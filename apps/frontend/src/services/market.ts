const API = import.meta.env.VITE_API_BASE || '/api';

export const marketApi = {
  getCollections: async (params?:Record<string,any>, signal?:AbortSignal) => {
    const q = new URLSearchParams(); if (params) Object.entries(params).forEach(([k,v])=> v!=null && q.set(k,String(v)));
    const res = await fetch(`${API}/nft/collections?${q.toString()}`, { signal });
    return res.json();
  },
  getItems: async (params?:Record<string,any>, signal?:AbortSignal) => {
    const q = new URLSearchParams(); if (params) Object.entries(params).forEach(([k,v])=> v!=null && q.set(k,String(v)));
    const res = await fetch(`${API}/nft/items?${q.toString()}`, { signal });
    return res.json();
  },
  getItem: async (address: string, signal?:AbortSignal) => {
    const res = await fetch(`${API}/nft/items/${address}`, { signal });
    return res.json();
  }
};
