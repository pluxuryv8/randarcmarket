import { GiftCollection, GiftItem, TraitBucket } from '../types/domain';
import { toHttp } from '../lib/media';

// Коллекции (канонический список из 86 Telegram Gift коллекций)
export const collections: GiftCollection[] = [
  {
    id: 'astral-shards',
    title: 'Astral Shards',
    cover: toHttp('ipfs://QmTestCover1'),
    floor: 12.5,
    supply: 150,
    owners: 120,
    volume24h: 850.25
  },
  {
    id: 'bday-candles',
    title: 'B-Day Candles',
    cover: toHttp('//example.com/candle-cover.jpg'),
    floor: 8.75,
    supply: 200,
    owners: 180,
    volume24h: 620.50
  },
  {
    id: 'berry-boxes',
    title: 'Berry Boxes',
    cover: toHttp('ipfs/QmTestCover3'),
    floor: 15.25,
    supply: 100,
    owners: 85,
    volume24h: 1100.75
  },
  {
    id: 'big-years',
    title: 'Big Years',
    cover: toHttp('https://example.com/year-cover.jpg'),
    floor: 22.0,
    supply: 75,
    owners: 65,
    volume24h: 1500.00
  },
  {
    id: 'bonded-rings',
    title: 'Bonded Rings',
    cover: undefined,
    floor: 18.5,
    supply: 120,
    owners: 95,
    volume24h: 1250.30
  }
];

// Предметы (Telegram Gift NFTs)
export const items: GiftItem[] = [
  // Astral Shards
  {
    id: '1',
    address: 'EQD...astral001',
    title: 'Astral Shard #001',
    image: toHttp('ipfs://QmTestImage1'),
    priceTon: 25.5,
    forSale: true,
    collectionId: 'astral-shards',
    collectionTitle: 'Astral Shards',
    traits: [
      { name: 'Type', value: 'Shard' },
      { name: 'Rarity', value: 'Legendary' },
      { name: 'Color', value: 'Purple' }
    ],
    rarity: 'Legendary',
    lastSaleTon: 22.0,
    updatedAt: '2024-08-24T10:30:00Z'
  },
  {
    id: '2',
    address: 'EQD...astral002',
    title: 'Astral Shard #002',
    image: toHttp('//example.com/astral-shard-2.jpg'),
    priceTon: 12.75,
    forSale: true,
    collectionId: 'astral-shards',
    collectionTitle: 'Astral Shards',
    traits: [
      { name: 'Type', value: 'Shard' },
      { name: 'Rarity', value: 'Rare' },
      { name: 'Color', value: 'Blue' }
    ],
    rarity: 'Rare',
    lastSaleTon: 11.5,
    updatedAt: '2024-08-24T09:15:00Z'
  },
  // B-Day Candles
  {
    id: '3',
    address: 'EQD...candle001',
    title: 'B-Day Candle #001',
    image: toHttp('ipfs/QmTestCandle1'),
    priceTon: 8.25,
    forSale: true,
    collectionId: 'bday-candles',
    collectionTitle: 'B-Day Candles',
    traits: [
      { name: 'Type', value: 'Candle' },
      { name: 'Rarity', value: 'Common' },
      { name: 'Color', value: 'Pink' }
    ],
    rarity: 'Common',
    lastSaleTon: 7.8,
    updatedAt: '2024-08-23T16:45:00Z'
  },
  // Berry Boxes
  {
    id: '4',
    address: 'EQD...berry001',
    title: 'Berry Box #001',
    image: toHttp('https://example.com/berry-box-1.jpg'),
    priceTon: 18.0,
    forSale: true,
    collectionId: 'berry-boxes',
    collectionTitle: 'Berry Boxes',
    traits: [
      { name: 'Type', value: 'Box' },
      { name: 'Rarity', value: 'Rare' },
      { name: 'Berry', value: 'Strawberry' }
    ],
    rarity: 'Rare',
    lastSaleTon: 16.5,
    updatedAt: '2024-08-24T11:20:00Z'
  },
  // Big Years
  {
    id: '5',
    address: 'EQD...year001',
    title: 'Big Year #001',
    image: undefined, // Тестируем fallback
    priceTon: 35.0,
    forSale: false,
    collectionId: 'big-years',
    collectionTitle: 'Big Years',
    traits: [
      { name: 'Type', value: 'Year' },
      { name: 'Rarity', value: 'Legendary' },
      { name: 'Year', value: '2024' }
    ],
    rarity: 'Legendary',
    lastSaleTon: 32.0,
    updatedAt: '2024-08-22T14:30:00Z'
  },
  // Bonded Rings
  {
    id: '6',
    address: 'EQD...ring001',
    title: 'Bonded Ring #001',
    image: toHttp('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyNjMyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2Y2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvbmRlZCBSaW5nPC90ZXh0Pjwvc3ZnPg=='),
    priceTon: 22.5,
    forSale: true,
    collectionId: 'bonded-rings',
    collectionTitle: 'Bonded Rings',
    traits: [
      { name: 'Type', value: 'Ring' },
      { name: 'Rarity', value: 'Rare' },
      { name: 'Material', value: 'Gold' }
    ],
    rarity: 'Rare',
    lastSaleTon: 20.0,
    updatedAt: '2024-08-24T08:45:00Z'
  },
  // Bow Ties
  {
    id: '7',
    address: 'EQD...bow001',
    title: 'Bow Tie #001',
    image: toHttp('ipfs://QmTestBow1'),
    priceTon: 15.75,
    forSale: true,
    collectionId: 'bow-ties',
    collectionTitle: 'Bow Ties',
    traits: [
      { name: 'Type', value: 'Tie' },
      { name: 'Rarity', value: 'Common' },
      { name: 'Color', value: 'Red' }
    ],
    rarity: 'Common',
    lastSaleTon: 14.0,
    updatedAt: '2024-08-24T07:30:00Z'
  },
  // Bunny Muffins
  {
    id: '8',
    address: 'EQD...bunny001',
    title: 'Bunny Muffin #001',
    image: toHttp('https://example.com/bunny-muffin-1.jpg'),
    priceTon: 9.5,
    forSale: true,
    collectionId: 'bunny-muffins',
    collectionTitle: 'Bunny Muffins',
    traits: [
      { name: 'Type', value: 'Muffin' },
      { name: 'Rarity', value: 'Common' },
      { name: 'Flavor', value: 'Chocolate' }
    ],
    rarity: 'Common',
    lastSaleTon: 8.25,
    updatedAt: '2024-08-24T06:15:00Z'
  },
  // Candy Canes
  {
    id: '9',
    address: 'EQD...candy001',
    title: 'Candy Cane #001',
    image: toHttp('ipfs/QmTestCandy1'),
    priceTon: 6.25,
    forSale: false,
    collectionId: 'candy-canes',
    collectionTitle: 'Candy Canes',
    traits: [
      { name: 'Type', value: 'Cane' },
      { name: 'Rarity', value: 'Common' },
      { name: 'Color', value: 'Red' }
    ],
    rarity: 'Common',
    lastSaleTon: 5.5,
    updatedAt: '2024-08-23T15:20:00Z'
  },
  // Cookie Hearts
  {
    id: '10',
    address: 'EQD...cookie001',
    title: 'Cookie Heart #001',
    image: undefined,
    priceTon: 7.8,
    forSale: true,
    collectionId: 'cookie-hearts',
    collectionTitle: 'Cookie Hearts',
    traits: [
      { name: 'Type', value: 'Cookie' },
      { name: 'Rarity', value: 'Rare' },
      { name: 'Shape', value: 'Heart' }
    ],
    rarity: 'Rare',
    lastSaleTon: 7.0,
    updatedAt: '2024-08-24T05:45:00Z'
  }
];

// Трейт-бакеты
export const traitBuckets: Record<string, TraitBucket[]> = {
  'astral-shards': [
    {
      group: 'Type',
      options: [
        { value: 'Shard', count: 150 }
      ]
    },
    {
      group: 'Rarity',
      options: [
        { value: 'Common', count: 90 },
        { value: 'Rare', count: 45 },
        { value: 'Legendary', count: 15 }
      ]
    },
    {
      group: 'Color',
      options: [
        { value: 'Purple', count: 60 },
        { value: 'Blue', count: 45 },
        { value: 'Green', count: 30 },
        { value: 'Red', count: 15 }
      ]
    }
  ],
  'bday-candles': [
    {
      group: 'Type',
      options: [
        { value: 'Candle', count: 200 }
      ]
    },
    {
      group: 'Rarity',
      options: [
        { value: 'Common', count: 120 },
        { value: 'Rare', count: 60 },
        { value: 'Legendary', count: 20 }
      ]
    },
    {
      group: 'Color',
      options: [
        { value: 'Pink', count: 80 },
        { value: 'Blue', count: 60 },
        { value: 'Yellow', count: 40 },
        { value: 'Purple', count: 20 }
      ]
    }
  ],
  'berry-boxes': [
    {
      group: 'Type',
      options: [
        { value: 'Box', count: 100 }
      ]
    },
    {
      group: 'Rarity',
      options: [
        { value: 'Common', count: 60 },
        { value: 'Rare', count: 30 },
        { value: 'Legendary', count: 10 }
      ]
    },
    {
      group: 'Berry',
      options: [
        { value: 'Strawberry', count: 40 },
        { value: 'Blueberry', count: 30 },
        { value: 'Raspberry', count: 20 },
        { value: 'Blackberry', count: 10 }
      ]
    }
  ],
  'big-years': [
    {
      group: 'Type',
      options: [
        { value: 'Year', count: 75 }
      ]
    },
    {
      group: 'Rarity',
      options: [
        { value: 'Common', count: 45 },
        { value: 'Rare', count: 22 },
        { value: 'Legendary', count: 8 }
      ]
    },
    {
      group: 'Year',
      options: [
        { value: '2024', count: 25 },
        { value: '2023', count: 20 },
        { value: '2022', count: 15 },
        { value: '2021', count: 10 },
        { value: '2020', count: 5 }
      ]
    }
  ],
  'bonded-rings': [
    {
      group: 'Type',
      options: [
        { value: 'Ring', count: 120 }
      ]
    },
    {
      group: 'Rarity',
      options: [
        { value: 'Common', count: 72 },
        { value: 'Rare', count: 36 },
        { value: 'Legendary', count: 12 }
      ]
    },
    {
      group: 'Material',
      options: [
        { value: 'Gold', count: 60 },
        { value: 'Silver', count: 40 },
        { value: 'Platinum', count: 15 },
        { value: 'Diamond', count: 5 }
      ]
    }
  ],
  'bow-ties': [
    {
      group: 'Type',
      options: [
        { value: 'Tie', count: 80 }
      ]
    },
    {
      group: 'Rarity',
      options: [
        { value: 'Common', count: 48 },
        { value: 'Rare', count: 24 },
        { value: 'Legendary', count: 8 }
      ]
    },
    {
      group: 'Color',
      options: [
        { value: 'Red', count: 30 },
        { value: 'Blue', count: 25 },
        { value: 'Green', count: 15 },
        { value: 'Purple', count: 10 }
      ]
    }
  ],
  'bunny-muffins': [
    {
      group: 'Type',
      options: [
        { value: 'Muffin', count: 120 }
      ]
    },
    {
      group: 'Rarity',
      options: [
        { value: 'Common', count: 72 },
        { value: 'Rare', count: 36 },
        { value: 'Legendary', count: 12 }
      ]
    },
    {
      group: 'Flavor',
      options: [
        { value: 'Chocolate', count: 50 },
        { value: 'Vanilla', count: 40 },
        { value: 'Strawberry', count: 20 },
        { value: 'Blueberry', count: 10 }
      ]
    }
  ],
  'candy-canes': [
    {
      group: 'Type',
      options: [
        { value: 'Cane', count: 90 }
      ]
    },
    {
      group: 'Rarity',
      options: [
        { value: 'Common', count: 54 },
        { value: 'Rare', count: 27 },
        { value: 'Legendary', count: 9 }
      ]
    },
    {
      group: 'Color',
      options: [
        { value: 'Red', count: 45 },
        { value: 'Green', count: 30 },
        { value: 'White', count: 15 }
      ]
    }
  ],
  'cookie-hearts': [
    {
      group: 'Type',
      options: [
        { value: 'Cookie', count: 110 }
      ]
    },
    {
      group: 'Rarity',
      options: [
        { value: 'Common', count: 66 },
        { value: 'Rare', count: 33 },
        { value: 'Legendary', count: 11 }
      ]
    },
    {
      group: 'Shape',
      options: [
        { value: 'Heart', count: 55 },
        { value: 'Star', count: 35 },
        { value: 'Circle', count: 20 }
      ]
    }
  ]
};
