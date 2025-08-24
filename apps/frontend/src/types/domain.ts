export type Trait = { 
  name: string; 
  value: string; 
  count?: number; 
};

export type TraitBucket = { 
  group: string; 
  options: Array<{value: string; count: number}>; 
};

export type GiftCollection = { 
  id: string; 
  title: string; 
  cover: string; 
  floor?: number; 
  supply?: number; 
  owners?: number; 
  volume24h?: number; 
};

export type GiftItem = { 
  id: string; 
  address: string; 
  title: string; 
  image: string; 
  priceTon?: number; 
  forSale?: boolean; 
  traits: Trait[]; 
  rarity?: string; 
  collectionId: string; 
  lastSaleTon?: number; 
  updatedAt?: string; 
};

export type ItemPage = { 
  items: GiftItem[]; 
  nextCursor?: string | null; 
};
