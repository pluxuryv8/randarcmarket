import { activities, collections, drops, gifts } from './mock';
import type { Collection, Gift, Drop, Activity, TimeRange } from '../types/domain';

// Здесь же можно быстро переключиться на реальный backend
// const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4001';

export async function getTrendingCollections(range: TimeRange): Promise<Collection[]> {
	// имитация задержки сети
	await new Promise(r=>setTimeout(r, 300));
	const result = collections
		.slice()
		.sort((a,b)=> b.stats[range].volumeTon - a.stats[range].volumeTon)
		.slice(0, 12);
	return result;
}

export async function getTopGifts(range: TimeRange): Promise<Gift[]> {
	await new Promise(r=>setTimeout(r, 300));
	const result = gifts
		.slice()
		.sort((a,b)=> b.stats[range].floorTon - a.stats[range].floorTon)
		.slice(0, 15);
	return result;
}

export async function getDrops(): Promise<Drop[]> {
	await new Promise(r=>setTimeout(r, 200));
	const result = drops.slice();
	return result;
}

export async function getLiveActivity(limit = 40): Promise<Activity[]> {
	await new Promise(r=>setTimeout(r, 200));
	const result = activities.slice(0, limit);
	return result;
}


