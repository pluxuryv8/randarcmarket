export interface NFTCollection {
  id: string;
  name: string;
  verified?: boolean;
  bannerUrl?: string;
  avatarUrl?: string;
  floorPriceTon?: number;
  volumeTon?: number;
  items?: number;
  owners?: number;
}

export interface NFTItem {
  id: string;
  name: string;
  imageUrl: string;
  collectionId: string;
  collectionName?: string;
  verified?: boolean;
  priceTon?: number;
  priceUsd?: number;
  traits?: Array<{ key: string; value: string | number }>;
}

export interface NFTDrop {
  id: string;
  title: string;
  imageUrl: string;
  startAt: number; // timestamp
  endAt: number;   // timestamp
  supply?: number;
  minted?: number;
}

