import { randomUUID } from 'crypto';

const store = new Set<string>(); // jti whitelist

export function issueJti() { const id = randomUUID(); store.add(id); return id; }
export function revokeJti(jti: string) { store.delete(jti); }
export function isActiveJti(jti?: string) { return jti ? store.has(jti) : false; }
