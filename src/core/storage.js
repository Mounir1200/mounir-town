// Browser storage can be missing or throw (private mode, blocked site data):
// the game must keep working without it, so every access is guarded.
export function createSafeStorage(backend = globalThis.localStorage) {
  return {
    get(key) {
      try {
        return backend?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        backend?.setItem(key, value);
      } catch {
        // The current visit still works with in-memory state.
      }
    },
    remove(key) {
      try {
        backend?.removeItem(key);
      } catch {
        // Nothing to clean up when storage is unavailable.
      }
    },
    getJSON(key) {
      const raw = this.get(key);
      if (raw === null) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    },
    setJSON(key, value) {
      this.set(key, JSON.stringify(value));
    },
  };
}
