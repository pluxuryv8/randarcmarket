export const formatTon = (n: number) => `${n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} TON`;
export const formatPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
export const timeAgo = (iso: string) => {
	const d = new Date(iso).getTime();
	const diff = Math.max(0, Date.now() - d);
	const m = Math.floor(diff / 60000);
	if (m < 60) return `${m} мин назад`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h} ч назад`;
	const days = Math.floor(h / 24);
	return `${days} дн назад`;
};


