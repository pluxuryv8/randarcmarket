import { executeOrder, deliverOrder } from '../services/radarBuyService';

export type Task = { type: 'execute' | 'deliver'; orderId: string };

const q: Task[] = [];

/**
 * Добавить задачу в очередь
 */
export function pushTask(t: Task) { 
  console.log(`[queue] Adding task: ${t.type} for order ${t.orderId} (queue size: ${q.length})`);
  q.push(t); 
  console.log(`[queue] Task added, new queue size: ${q.length}`);
}

/**
 * Запустить воркеры для обработки очереди
 */
export function runWorkers() {
  console.log('🚀 Starting radar workers...');
  setInterval(async () => {
    const t = q.shift();
    if (!t) {
      // Логируем только каждые 10 секунд, чтобы не спамить
      if (Math.random() < 0.01) {
        console.log(`[worker] Queue empty, waiting... (queue size: ${q.length})`);
      }
      return;
    }
    
    try {
      console.log(`[worker] Processing task: ${t.type} for order ${t.orderId}`);
      if (t.type === 'execute') {
        await executeOrder(t.orderId);
        // После успешного исполнения → сразу в доставку
        pushTask({ type: 'deliver', orderId: t.orderId });
      } else {
        await deliverOrder(t.orderId);
      }
      console.log(`[worker] Task completed: ${t.type} for order ${t.orderId}`);
    } catch (e) {
      // Лог + можно ретраить по простой схеме
      console.error('[worker] task fail', e);
    }
  }, 400);
}
