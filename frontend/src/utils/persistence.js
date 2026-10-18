// Browser-only persistence. Storage may be unavailable in private/restricted sessions.
export function readStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}
export function writeStored(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Keep forms usable. */ }
}
export function removeStored(key) {
  try { localStorage.removeItem(key); } catch { /* Keep forms usable. */ }
}
export function draftKey(user, name) {
  return `florglass:draft:v1:${user?.role || 'guest'}:${user?.id ?? 'guest'}:${name}`;
}
