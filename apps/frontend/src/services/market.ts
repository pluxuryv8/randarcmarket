const API = import.meta.env.VITE_API_BASE || '/api';

export const marketApi = {
  getCollections: async ()=> (await fetch(`${API}/nft/collections`)).json(),
  getItems: async (params:Record<string,any>)=>{
    const q = new URLSearchParams(); 
    Object.entries(params).forEach(([k,v])=> v!=null && q.set(k,String(v)));
    return (await fetch(`${API}/nft/items?`+q.toString())).json();
  },
  getItem: async (addr:string)=> (await fetch(`${API}/nft/items/${addr}`)).json(),
};
