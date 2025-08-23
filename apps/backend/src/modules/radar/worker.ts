import { WatchlistFilter, RadarSignal, NFTItem } from '../../types';
import { getCollectionItems, getItemDetails } from '../nft/indexer';

// In-memory storage for MVP
const watchlistFilters = new Map<string, WatchlistFilter[]>();
const radarSignals = new Map<string, RadarSignal[]>();

export function addWatchlistFilter(userId: string, filter: WatchlistFilter): void {
  const userFilters = watchlistFilters.get(userId) || [];
  userFilters.push(filter);
  watchlistFilters.set(userId, userFilters);
}

export function removeWatchlistFilter(userId: string, filterId: string): boolean {
  const userFilters = watchlistFilters.get(userId);
  if (!userFilters) return false;
  
  const index = userFilters.findIndex(f => f.id === filterId);
  if (index === -1) return false;
  
  userFilters.splice(index, 1);
  watchlistFilters.set(userId, userFilters);
  return true;
}

export function getUserWatchlist(userId: string): WatchlistFilter[] {
  return watchlistFilters.get(userId) || [];
}

export function getUserSignals(userId: string, since?: Date): RadarSignal[] {
  const signals = radarSignals.get(userId) || [];
  if (!since) return signals;
  
  return signals.filter(signal => signal.created_at >= since);
}

async function computeSignals(filter: WatchlistFilter, items: NFTItem[]): Promise<RadarSignal[]> {
  const signals: RadarSignal[] = [];
  
  for (const item of items) {
    // Price drop signal
    if (filter.min_price && filter.max_price) {
      if (item.price && item.price >= filter.min_price && item.price <= filter.max_price) {
        signals.push({
          id: crypto.randomUUID(),
          user_id: filter.user_id,
          filter_id: filter.id,
          item_address: item.address,
          signal_type: 'price_drop',
          message: `Item ${item.name} is now priced at ${item.price} TON (within your range)`,
          created_at: new Date()
        });
      }
    }
    
    // Below floor signal
    if (filter.below_floor_percent && item.price) {
      // TODO: Get floor price from collection
      const floorPrice = 0; // Replace with actual floor price
      if (floorPrice > 0) {
        const percentBelow = ((floorPrice - item.price) / floorPrice) * 100;
        if (percentBelow >= filter.below_floor_percent) {
          signals.push({
            id: crypto.randomUUID(),
            user_id: filter.user_id,
            filter_id: filter.id,
            item_address: item.address,
            signal_type: 'below_floor',
            message: `Item ${item.name} is ${percentBelow.toFixed(1)}% below floor price`,
            created_at: new Date()
          });
        }
      }
    }
    
    // Rarity match signal
    if (filter.rarity_filter && item.rarity_score) {
      const rarityMatch = filter.rarity_filter.some(rarity => 
        item.rarity_score && item.rarity_score >= parseFloat(rarity)
      );
      if (rarityMatch) {
        signals.push({
          id: crypto.randomUUID(),
          user_id: filter.user_id,
          filter_id: filter.id,
          item_address: item.address,
          signal_type: 'rarity_match',
          message: `Rare item ${item.name} matches your criteria (score: ${item.rarity_score})`,
          created_at: new Date()
        });
      }
    }
  }
  
  return signals;
}

export async function runRadarTick(): Promise<void> {
  try {
    console.log('🔄 Running Radar tick...');
    
    for (const [userId, filters] of watchlistFilters) {
      for (const filter of filters) {
        try {
          let items: NFTItem[] = [];
          
          if (filter.collection_address) {
            // Get items from specific collection
            items = await getCollectionItems(filter.collection_address);
          } else {
            // TODO: Get items from all collections (implement pagination)
            items = [];
          }
          
          const signals = await computeSignals(filter, items);
          
          // Store signals
          const userSignals = radarSignals.get(userId) || [];
          userSignals.push(...signals);
          radarSignals.set(userId, userSignals);
          
          // TODO: Send notifications to Telegram bot
          for (const signal of signals) {
            console.log(`📡 Signal for user ${userId}: ${signal.message}`);
            // await sendTelegramNotification(userId, signal.message);
          }
          
        } catch (error) {
          console.error(`Error processing filter ${filter.id} for user ${userId}:`, error);
        }
      }
    }
    
    console.log('✅ Radar tick completed');
  } catch (error) {
    console.error('Error in radar tick:', error);
  }
}

// Start radar worker (runs every 30 seconds)
export function startRadarWorker(): void {
  setInterval(runRadarTick, 30 * 1000);
  console.log('🚀 Radar worker started');
}
