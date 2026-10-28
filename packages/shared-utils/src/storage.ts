/**
 * Safe wrappers around Web Storage. Never store secrets (tokens, passwords) here —
 * use httpOnly cookies for credentials. Only store non-sensitive UI preferences.
 */
function getStore(kind: 'local' | 'session'): Storage | null {
  try {
    return kind === 'local' ? globalThis.localStorage : globalThis.sessionStorage;
  } catch {
    return null;
  }
}

export function getStoredValue<T>(
  key: string,
  fallback: T,
  kind: 'local' | 'session' = 'local',
): T {
  const store = getStore(kind);
  if (!store) return fallback;
  try {
    const raw = store.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function setStoredValue<T>(
  key: string,
  value: T,
  kind: 'local' | 'session' = 'local',
): boolean {
  const store = getStore(kind);
  if (!store) return false;
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStoredValue(key: string, kind: 'local' | 'session' = 'local'): void {
  getStore(kind)?.removeItem(key);
}
