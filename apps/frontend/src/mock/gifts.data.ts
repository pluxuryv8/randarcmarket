import { GiftCollection, GiftItem, TraitBucket } from '../types/domain';

// Коллекции
export const collections: GiftCollection[] = [
  {
    id: 'telegram-gifts-2024',
    title: 'Telegram Gifts 2024',
    cover: 'https://via.placeholder.com/400x200/1f2632/666?text=Telegram+Gifts',
    floor: 15.5,
    supply: 1000,
    owners: 450,
    volume24h: 1250.75
  },
  {
    id: 'crypto-punks-ton',
    title: 'Crypto Punks TON',
    cover: 'https://via.placeholder.com/400x200/1f2632/666?text=Crypto+Punks',
    floor: 45.2,
    supply: 500,
    owners: 320,
    volume24h: 3200.50
  },
  {
    id: 'nft-artists',
    title: 'NFT Artists Collection',
    cover: 'https://via.placeholder.com/400x200/1f2632/666?text=NFT+Artists',
    floor: 8.75,
    supply: 2000,
    owners: 1200,
    volume24h: 890.25
  }
];

// Предметы
export const items: GiftItem[] = [
  // Telegram Gifts
  {
    id: '1',
    address: 'EQD...abc123',
    title: 'Golden Telegram Gift',
    image: 'https://via.placeholder.com/300x300/1f2632/666?text=Golden+Gift',
    priceTon: 25.5,
    forSale: true,
    collectionId: 'telegram-gifts-2024',
    traits: [
      { name: 'Type', value: 'Gift' },
      { name: 'Rarity', value: 'Legendary' },
      { name: 'Color', value: 'Gold' }
    ],
    rarity: 'Legendary',
    lastSaleTon: 22.0,
    updatedAt: '2024-08-24T10:30:00Z'
  },
  {
    id: '2',
    address: 'EQD...def456',
    title: 'Silver Telegram Gift',
    image: 'https://via.placeholder.com/300x300/1f2632/666?text=Silver+Gift',
    priceTon: 12.75,
    forSale: true,
    collectionId: 'telegram-gifts-2024',
    traits: [
      { name: 'Type', value: 'Gift' },
      { name: 'Rarity', value: 'Rare' },
      { name: 'Color', value: 'Silver' }
    ],
    rarity: 'Rare',
    lastSaleTon: 11.5,
    updatedAt: '2024-08-24T09:15:00Z'
  },
  {
    id: '3',
    address: 'EQD...ghi789',
    title: 'Bronze Telegram Gift',
    image: 'https://via.placeholder.com/300x300/1f2632/666?text=Bronze+Gift',
    priceTon: 5.25,
    forSale: false,
    collectionId: 'telegram-gifts-2024',
    traits: [
      { name: 'Type', value: 'Gift' },
      { name: 'Rarity', value: 'Common' },
      { name: 'Color', value: 'Bronze' }
    ],
    rarity: 'Common',
    lastSaleTon: 4.8,
    updatedAt: '2024-08-23T16:45:00Z'
  },
  // Crypto Punks
  {
    id: '4',
    address: 'EQD...jkl012',
    title: 'Punk #001',
    image: 'https://via.placeholder.com/300x300/1f2632/666?text=Punk+001',
    priceTon: 55.0,
    forSale: true,
    collectionId: 'crypto-punks-ton',
    traits: [
      { name: 'Background', value: 'Blue' },
      { name: 'Eyes', value: 'Laser' },
      { name: 'Mouth', value: 'Smile' }
    ],
    rarity: 'Legendary',
    lastSaleTon: 52.5,
    updatedAt: '2024-08-24T11:20:00Z'
  },
  {
    id: '5',
    address: 'EQD...mno345',
    title: 'Punk #002',
    image: 'https://via.placeholder.com/300x300/1f2632/666?text=Punk+002',
    priceTon: 38.75,
    forSale: true,
    collectionId: 'crypto-punks-ton',
    traits: [
      { name: 'Background', value: 'Red' },
      { name: 'Eyes', value: 'Normal' },
      { name: 'Mouth', value: 'Frown' }
    ],
    rarity: 'Rare',
    lastSaleTon: 35.0,
    updatedAt: '2024-08-24T08:30:00Z'
  },
  // NFT Artists
  {
    id: '6',
    address: 'EQD...pqr678',
    title: 'Digital Art #001',
    image: 'https://via.placeholder.com/300x300/1f2632/666?text=Digital+Art',
    priceTon: 15.25,
    forSale: true,
    collectionId: 'nft-artists',
    traits: [
      { name: 'Style', value: 'Abstract' },
      { name: 'Colors', value: 'Vibrant' },
      { name: 'Size', value: 'Large' }
    ],
    rarity: 'Rare',
    lastSaleTon: 14.0,
    updatedAt: '2024-08-24T12:10:00Z'
  }
];

// Трейт-бакеты
export const traitBuckets: Record<string, TraitBucket[]> = {
  'telegram-gifts-2024': [
    {
      group: 'Type',
      options: [
        { value: 'Gift', count: 1000 }
      ]
    },
    {
      group: 'Rarity',
      options: [
        { value: 'Common', count: 600 },
        { value: 'Rare', count: 300 },
        { value: 'Legendary', count: 100 }
      ]
    },
    {
      group: 'Color',
      options: [
        { value: 'Bronze', count: 600 },
        { value: 'Silver', count: 300 },
        { value: 'Gold', count: 100 }
      ]
    }
  ],
  'crypto-punks-ton': [
    {
      group: 'Background',
      options: [
        { value: 'Blue', count: 150 },
        { value: 'Red', count: 120 },
        { value: 'Green', count: 100 },
        { value: 'Purple', count: 80 },
        { value: 'Yellow', count: 50 }
      ]
    },
    {
      group: 'Eyes',
      options: [
        { value: 'Normal', count: 200 },
        { value: 'Laser', count: 50 },
        { value: '3D', count: 80 },
        { value: 'Zombie', count: 30 },
        { value: 'Alien', count: 20 }
      ]
    },
    {
      group: 'Mouth',
      options: [
        { value: 'Smile', count: 180 },
        { value: 'Frown', count: 100 },
        { value: 'Open', count: 80 },
        { value: 'Pipe', count: 40 },
        { value: 'Cigar', count: 20 }
      ]
    }
  ],
  'nft-artists': [
    {
      group: 'Style',
      options: [
        { value: 'Abstract', count: 800 },
        { value: 'Realistic', count: 600 },
        { value: 'Minimalist', count: 400 },
        { value: 'Surreal', count: 200 }
      ]
    },
    {
      group: 'Colors',
      options: [
        { value: 'Vibrant', count: 600 },
        { value: 'Muted', count: 500 },
        { value: 'Monochrome', count: 400 },
        { value: 'Pastel', count: 300 },
        { value: 'Neon', count: 200 }
      ]
    },
    {
      group: 'Size',
      options: [
        { value: 'Small', count: 400 },
        { value: 'Medium', count: 600 },
        { value: 'Large', count: 300 },
        { value: 'Extra Large', count: 100 }
      ]
    }
  ]
};
