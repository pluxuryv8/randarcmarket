const API = import.meta.env.VITE_API_BASE || '/api';

export async function me(access?:string) {
  const res = await fetch(`${API}/auth/me`, { headers: access? { Authorization: `Bearer ${access}` } : {} });
  return res.json();
}
