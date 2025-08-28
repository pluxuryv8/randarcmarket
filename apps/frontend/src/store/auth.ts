import { create } from 'zustand';

type State = { access?: string; user?: { id:string; tgId?:string; wallet?:string; role?:'admin'|'user' } };
type Actions = {
  setAccess: (t?:string)=>void;
  setUser: (u?:State['user'])=>void;
};

export const useAuthStore = create<State & Actions>((set)=>({
  access: undefined,
  user: undefined,
  setAccess: (access)=> set({ access }),
  setUser: (user)=> set({ user }),
}));
