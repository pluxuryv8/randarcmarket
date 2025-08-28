import { prisma } from '../db/client';
import { pushTask } from '../workers/queue';
import { radarOrdersTotal, radarExecutionDurationMs, radarDeliveryTotal } from '../observability/metrics';

export interface PaymentLink {
  amountTon: number;
  comment: string;
  returnUrl: string;
  payload: string;
}

export interface OrderInfo {
  status: string;
  txHash?: string;
}

/**
 * Оплата резервации с баланса пользователя
 */
export async function payReservationWithBalance(reservationId: string, userId: string): Promise<{ orderId: string }> {
  // Найти резервацию
  const reservation = await prisma.radarReservation.findFirst({
    where: {
      id: reservationId,
      userId,
      status: 'pending',
      expiresAt: { gt: new Date() }
    }
  });

  if (!reservation) {
    throw new Error('Reservation not found or expired');
  }

  // Транзакция: проверка баланса, списание, создание заказа
  const result = await prisma.$transaction(async (tx) => {
    // Получить или создать баланс
    let balance = await tx.walletBalance.findUnique({
      where: { userId }
    });

    if (!balance) {
      balance = await tx.walletBalance.create({
        data: { userId, ton: 0 }
      });
    }

    // Проверить достаточность средств
    if (balance.ton < reservation.priceTon) {
      throw new Error('Insufficient balance');
    }

    // Списать средства
    await tx.walletBalance.update({
      where: { userId },
      data: { ton: balance.ton - reservation.priceTon }
    });

    // Создать заказ
    const order = await tx.radarOrder.create({
      data: {
        reservationId: reservation.id,
        userId: reservation.userId,
        itemAddress: reservation.itemAddress,
        source: reservation.source,
        priceTon: reservation.priceTon,
        status: 'created'
      }
    });

    // Отменить резервацию
    await tx.radarReservation.update({
      where: { id: reservation.id },
      data: { status: 'cancelled' }
    });

    return order;
  });

  // Обновить метрики
  radarOrdersTotal.inc({ status: 'created' });

  return { orderId: result.id };
}

/**
 * Получить ссылку для оплаты через TonConnect
 */
export async function getTonConnectPaymentLink(reservationId: string, userId: string): Promise<PaymentLink> {
  // Найти резервацию
  const reservation = await prisma.radarReservation.findFirst({
    where: {
      id: reservationId,
      userId,
      status: 'pending',
      expiresAt: { gt: new Date() }
    }
  });

  if (!reservation) {
    throw new Error('Reservation not found or expired');
  }

  // Создать payload для TonConnect
  const payload = JSON.stringify({
    reservationId,
    userId,
    amountTon: reservation.priceTon,
    timestamp: Date.now()
  });

  return {
    amountTon: reservation.priceTon,
    comment: `Radar order: ${reservation.itemAddress}`,
    returnUrl: `${process.env.CLIENT_ORIGIN}/radar/payment/success`,
    payload
  };
}

/**
 * Подтверждение оплаты через TonConnect
 */
export async function confirmTonConnectPayment(reservationId: string, userId: string, proof: any): Promise<{ orderId: string }> {
  // Найти резервацию
  const reservation = await prisma.radarReservation.findFirst({
    where: {
      id: reservationId,
      userId,
      status: 'pending',
      expiresAt: { gt: new Date() }
    }
  });

  if (!reservation) {
    throw new Error('Reservation not found or expired');
  }

  // На MVP доверяем proof (в продакшене нужно валидировать)
  const result = await prisma.$transaction(async (tx) => {
    // Создать заказ
    const order = await tx.radarOrder.create({
      data: {
        reservationId: reservation.id,
        userId: reservation.userId,
        itemAddress: reservation.itemAddress,
        source: reservation.source,
        priceTon: reservation.priceTon,
        status: 'created'
      }
    });

    // Отменить резервацию
    await tx.radarReservation.update({
      where: { id: reservation.id },
      data: { status: 'cancelled' }
    });

    return order;
  });

  // Обновить метрики
  radarOrdersTotal.inc({ status: 'created' });

  return { orderId: result.id };
}

/**
 * Поставить заказ в очередь исполнения
 */
export async function enqueueExecution(orderId: string): Promise<void> {
  console.log(`📋 Enqueueing order ${orderId} for execution`);
  
  // Обновить статус заказа
  await prisma.radarOrder.update({
    where: { id: orderId },
    data: { status: 'queued' }
  });

  // Добавить в очередь
  pushTask({ type: 'execute', orderId });
  console.log(`✅ Order ${orderId} added to execution queue`);

  // Обновить метрики
  radarOrdersTotal.inc({ status: 'queued' });
}

/**
 * Исполнить заказ (имитация ончейн-покупки)
 */
export async function executeOrder(orderId: string): Promise<void> {
  const startTime = Date.now();

  // Обновить статус на "в процессе"
  await prisma.radarOrder.update({
    where: { id: orderId },
    data: { status: 'onchain_pending' }
  });

  radarOrdersTotal.inc({ status: 'onchain_pending' });

  // Имитация времени исполнения
  const executionTime = Math.random() * 700 + 800; // 800-1500ms
  await new Promise(resolve => setTimeout(resolve, executionTime));

  // 90% успех, 10% неудача
  const isSuccess = Math.random() < 0.9;
  
  if (isSuccess) {
    // Успешное исполнение
    const fakeTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    await prisma.radarOrder.update({
      where: { id: orderId },
      data: { 
        status: 'onchain_ok',
        txHash: fakeTxHash
      }
    });

    radarOrdersTotal.inc({ status: 'onchain_ok' });
  } else {
    // Неудачное исполнение
    await prisma.radarOrder.update({
      where: { id: orderId },
      data: { status: 'onchain_fail' }
    });

    radarOrdersTotal.inc({ status: 'onchain_fail' });
  }

  // Обновить метрики времени исполнения
  const duration = Date.now() - startTime;
  radarExecutionDurationMs.observe(duration);
}

/**
 * Доставить заказ (имитация доставки)
 */
export async function deliverOrder(orderId: string, toAddress?: string): Promise<void> {
  // Проверить, что заказ успешно исполнен
  const order = await prisma.radarOrder.findUnique({
    where: { id: orderId }
  });

  if (!order || order.status !== 'onchain_ok') {
    throw new Error('Order not ready for delivery');
  }

  // Имитация времени доставки
  await new Promise(resolve => setTimeout(resolve, 500));

  // На MVP сразу доставляем
  await prisma.radarOrder.update({
    where: { id: orderId },
    data: { status: 'delivered' }
  });

  // Обновить метрики
  radarOrdersTotal.inc({ status: 'delivered' });
  radarDeliveryTotal.inc({ status: 'delivered' });
}

/**
 * Получить информацию о заказе
 */
export async function getOrder(id: string, userId: string): Promise<OrderInfo> {
  const order = await prisma.radarOrder.findFirst({
    where: { id, userId },
    select: { status: true, txHash: true }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return {
    status: order.status,
    txHash: order.txHash || undefined
  };
}
