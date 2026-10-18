import { useCallback, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { draftKey, readStored, removeStored, writeStored } from '../utils/persistence';

// Write on each edit, so even an immediate refresh retains the latest keystroke.
export function useDraft(name, initialValue) {
  const { user } = useAuth();
  const key = draftKey(user, name);
  const [entry, setEntry] = useState(() => ({ key, value: readStored(key, initialValue) }));
  const current = useRef(entry);
  const value = entry.key === key ? entry.value : readStored(key, initialValue);
  const update = next => {
    const updated = typeof next === 'function' ? next(current.current.key === key ? current.current.value : value) : next;
    current.current = { key, value: updated };
    writeStored(key, updated);
    setEntry(current.current);
  };
  const clear = () => {
    removeStored(key);
    current.current = { key, value: initialValue };
    setEntry(current.current);
  };
  // Fetching an existing record must not overwrite an unsaved draft.
  const hydrate = useCallback(record => {
    const restored = readStored(key, record);
    current.current = { key, value: restored };
    setEntry(current.current);
  }, [key]);
  return [value, update, clear, hydrate];
}
