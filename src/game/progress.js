const EMPTY_PROGRESS = { visited: [], skills: [], introSeen: false, celebrated: [] };

// Remembers visited places and found skills for this visitor (browser storage only).
export class ProgressTracker {
  #state;
  #listeners = new Set();

  constructor(storage, storageKey, totals) {
    this.storage = storage;
    this.storageKey = storageKey;
    this.totals = totals;
    this.#state = { ...EMPTY_PROGRESS, ...(storage.getJSON(storageKey) ?? {}) };
  }

  get visitedCount() {
    return this.#state.visited.length;
  }

  get skillCount() {
    return this.#state.skills.length;
  }

  get introSeen() {
    return this.#state.introSeen;
  }

  get hasAllPlaces() {
    return this.visitedCount >= this.totals.places;
  }

  get hasAllSkills() {
    return this.skillCount >= this.totals.skills;
  }

  hasVisited(id) {
    return this.#state.visited.includes(id);
  }

  hasSkill(id) {
    return this.#state.skills.includes(id);
  }

  visit(id) {
    return this.#addTo('visited', id);
  }

  collect(id) {
    return this.#addTo('skills', id);
  }

  markIntroSeen() {
    this.#state.introSeen = true;
    this.#save();
  }

  // True only the first time a milestone is reached, so celebrations play once.
  celebrateOnce(milestone) {
    return this.#addTo('celebrated', milestone);
  }

  reset() {
    this.#state = { ...EMPTY_PROGRESS, introSeen: this.#state.introSeen };
    this.#save();
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  #addTo(list, id) {
    if (this.#state[list].includes(id)) return false;
    this.#state[list] = [...this.#state[list], id];
    this.#save();
    return true;
  }

  #save() {
    this.storage.setJSON(this.storageKey, this.#state);
    this.#listeners.forEach(listener => listener(this));
  }
}
