import { prisma } from '../db/client';
import tonapi from '../providers/gifts/tonapi';
import nftscan from '../providers/gifts/nftscan';

const enabled = process.env.INDEXER_ENABLED === 'true';
const intervalSec = Number(process.env.INDEXER_PULL_INTERVAL_SEC || 120);
const sources = (process.env.INDEXER_SOURCES || 'tonapi,nftscan').split(',').map(s=>s.trim()) as ('tonapi'|'nftscan')[];

type Provider = { name: 'tonapi'|'nftscan'; listCollections: any; listItems: any; };
const providers: Provider[] = [
  { name:'tonapi', listCollections: tonapi.listCollections.bind(tonapi), listItems: tonapi.listItems.bind(tonapi) },
  { name:'nftscan', listCollections: nftscan.listCollections.bind(nftscan), listItems: nftscan.listItems.bind(nftscan) },
];

function getProvider(name:'tonapi'|'nftscan') { return providers.find(p=>p.name===name)!; }

async function upsertCollections(cols:any[]) {
  for (const c of cols) {
    await prisma.collection.upsert({
      where: { id: c.id },
      update: {
        title: c.title ?? 'Unknown',
        address: c.address,
        cover: c.cover,
        supply: c.supply ?? null,
        owners: c.owners ?? null,
        floorTon: c.floorTon ?? null,
        volume24hTon: c.volume24hTon ?? null,
      },
      create: {
        id: c.id, address: c.address, title: c.title ?? 'Unknown',
        cover: c.cover, supply: c.supply ?? null, owners: c.owners ?? null,
        floorTon: c.floorTon ?? null, volume24hTon: c.volume24hTon ?? null,
      }
    });
  }
}

async function upsertItems(items:any[]) {
  for (const r of items) {
    await prisma.item.upsert({
      where: { id: r.id },
      update: {
        title: r.title ?? 'NFT',
        address: r.address,
        image: r.image, animationUrl: r.animationUrl,
        priceTon: r.priceTon ?? null, forSale: !!r.forSale,
        lastSaleTon: r.lastSaleTon ?? null,
        collectionId: r.collectionId ?? null,
        updatedAt: new Date(r.updatedAt || Date.now())
      },
      create: {
        id: r.id, address: r.address, title: r.title ?? 'NFT',
        image: r.image, animationUrl: r.animationUrl,
        priceTon: r.priceTon ?? null, forSale: !!r.forSale,
        lastSaleTon: r.lastSaleTon ?? null,
        collectionId: r.collectionId ?? null,
        updatedAt: new Date(r.updatedAt || Date.now())
      }
    });
    // Трейты — опционально, можно пропустить на первом этапе (много вставок)
  }
}

export async function runIndexerOnce() {
  const order = sources.map(getProvider);
  // 1) колекции (по 100)
  for (const p of order) {
    try {
      const cols = await p.listCollections({ limit: 100, offset: 0 });
      if (cols?.length) { await upsertCollections(cols); break; }
    } catch {}
  }
  // 2) популярные айтемы (по 200, без forSale фильтра для наполнения)
  for (const p of order) {
    try {
      const items = await p.listItems({ limit: 200, offset: 0 });
      if (items?.length) { await upsertItems(items); break; }
    } catch {}
  }
}

export function startIndexerLoop() {
  if (!enabled) return;
  runIndexerOnce().catch(()=>{});
  setInterval(()=> {
    runIndexerOnce().catch(()=>{});
  }, intervalSec * 1000);
}
