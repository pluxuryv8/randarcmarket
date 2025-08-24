export type Trait = { name: string; value: string; count?: number };
export type TraitBucket = { group: string; options: Array<{ value: string; count: number }> };

export type Collection = {
  id: string; address?: string; title: string; cover?: string;
  supply?: number; owners?: number; floorTon?: number; volume24hTon?: number;
};

export type Item = {
  id: string; address: string; title: string;
  image?: string; animationUrl?: string;
  priceTon?: number; forSale?: boolean; lastSaleTon?: number;
  collectionId: string; traits: Trait[]; updatedAt?: string;
};

export type ItemPage = { items: Item[]; nextCursor?: string | null };

export interface GiftsProvider {
  listCollections(params?: { search?: string }): Promise<Collection[]>;
  getCollectionById(id: string): Promise<Collection | null>;
  getTraits(collectionId: string): Promise<TraitBucket[]>;
  listItems(params: {
    collectionId?: string; forSale?: boolean; minPrice?: number; maxPrice?: number;
    traits?: Record<string,string[]>; search?: string; sort?: 'price'|'listed_at'|'sold_at'|'volume_24h';
    order?: 'asc'|'desc'; limit?: number; cursor?: string|null;
  }): Promise<ItemPage>;
  getItem(address: string): Promise<Item | null>;
  listActivity(params: { collectionId?: string; since?: string }): Promise<any[]>;
}
