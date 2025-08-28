import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { me } from '../services/auth';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const access = useAuthStore(s => s.access);
  const setUser = useAuthStore(s => s.setUser);
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const info = await me(access);
      // сервер сейчас возвращает {authenticated, id, tgId, wallet}
      if (info.authenticated) {
        setUser({ id: info.id, tgId: info.tgId, wallet: info.wallet });
        // роль на клиента не шлём — админка всё равно защищена бэком; здесь лишь «мягкая» проверка
        setOk(true);
      } else setOk(false);
    })();
  }, [access, setUser]);

  if (ok === null) return <div className="p-6">Checking access…</div>;
  if (!ok) return <div className="p-6">Access denied</div>;
  return <>{children}</>;
}
