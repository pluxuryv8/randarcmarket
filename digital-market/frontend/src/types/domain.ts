export type TimeRange = '1d'|'7d'|'30d'|'all';

export interface Stat { 
  floorTon: number; 
  volumeTon: number; 
  changePct: number; 
}

export interface BaseEntity { 
  id: string; 
  name: string; 
  image: string; 
  verified?: boolean; 
}

export interface Collection extends BaseEntity { 
  stats: Record<TimeRange, Stat>; 
}

export interface Gift extends BaseEntity { 
  stats: Record<TimeRange, Stat>; 
}

export interface Drop { 
  id: string; 
  title: string; 
  image: string; 
  description?: string; 
  startsAt?: string; 
  cta?: string; 
}

export interface Activity { 
  id: string; 
  image: string; 
  title: string; 
  priceTon: number; 
  user: string; 
  ago: string; 
}
