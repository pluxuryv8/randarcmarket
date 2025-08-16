import { Activity, Collection, Drop, Gift, Stat, TimeRange } from '../types/domain';

const rand = (min:number, max:number)=> Math.random()*(max-min)+min;
const pick = <T,>(arr:T[])=> arr[Math.floor(Math.random()*arr.length)];

const ranges: TimeRange[] = ['1d','7d','30d','all'];
const makeStats = (): Record<TimeRange, Stat> => {
	return ranges.reduce((acc, r)=>{
		const floor = parseFloat(rand(5, 500).toFixed(2));
		const volume = parseFloat(rand(100, 50000).toFixed(2));
		const change = parseFloat(rand(-25, 40).toFixed(2));
		(acc as any)[r] = { floorTon: floor, volumeTon: volume, changePct: change };
		return acc;
	}, {} as Record<TimeRange, Stat>);
};

const collectionNames = [
	'Randar Punks', 'TON Apes', 'Metal Pearls', 'Red Spectrum', 'TON Cats', 'Shadow Ninjas',
	'Crimson Blades', 'Neon Lotus', 'Quantum Keys', 'Cyber Owls', 'Nova Shards', 'Eclipse Art',
	'Ruby Voxels', 'Iron Souls', 'Scarlet Dreams', 'Ghost Protocol', 'Astra Cards', 'Dark Gardens'
];

const images = (i:number)=>`https://picsum.photos/seed/randar_${i}/640/400`;

export const collections: Collection[] = Array.from({ length: 16 }).map((_, i)=>({
	id: `col_${i+1}`,
	name: collectionNames[i % collectionNames.length],
	image: images(i),
	verified: Math.random() > 0.65,
	stats: makeStats()
}));

export const gifts: Gift[] = Array.from({ length: 14 }).map((_, i)=>({
	id: `gift_${i+1}`,
	name: `Gift #${i+1}`,
	image: images(i+40),
	verified: Math.random() > 0.5,
	stats: makeStats()
}));

export const drops: Drop[] = Array.from({ length: 7 }).map((_, i)=>({
	id: `drop_${i+1}`,
	title: `Drop ${i+1}: ${pick(collectionNames)}`,
	image: images(i+80),
	description: 'Ограниченный выпуск коллекционных NFT.',
	startsAt: new Date(Date.now()+ i*86400000).toISOString(),
	cta: 'Участвовать'
}));

const users = ['@randar','@nova','@eclipse','@scarlet','@metal','@ghost','@cyber'];
export const activities: Activity[] = Array.from({ length: 48 }).map((_, i)=>({
	id: `act_${i+1}`,
	image: images(i+120),
	title: `${pick(collectionNames)} #${Math.floor(rand(100,999))}`,
	priceTon: parseFloat(rand(1, 250).toFixed(2)),
	user: pick(users),
	ago: `${Math.floor(rand(1, 59))} мин назад`
}));


