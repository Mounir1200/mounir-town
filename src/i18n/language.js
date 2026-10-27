export const SUPPORTED_LANGUAGES = ['fr', 'en'];
export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_STORAGE_KEY = 'mounir-language';

export function isSupportedLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language);
}

export function browserLanguage(preferences = []) {
  const match = preferences
    .map(value => String(value).toLowerCase().split('-')[0])
    .find(isSupportedLanguage);
  return match ?? DEFAULT_LANGUAGE;
}

// An explicit ?lang= link wins over a saved choice, which wins over browser preferences.
export function resolveLanguage({ requested, saved, preferences }) {
  if (isSupportedLanguage(requested)) return requested;
  if (isSupportedLanguage(saved)) return saved;
  return browserLanguage(preferences);
}

export class LanguageService {
  #current;
  #listeners = new Set();
  #storage;
  #location;
  #history;

  constructor({ storage, location, history, navigator }) {
    this.#storage = storage;
    this.#location = location;
    this.#history = history;
    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language ?? DEFAULT_LANGUAGE];
    this.#current = resolveLanguage({
      requested: new URL(location.href).searchParams.get('lang'),
      saved: storage.get(LANGUAGE_STORAGE_KEY),
      preferences,
    });
  }

  get current() {
    return this.#current;
  }

  set(language) {
    if (!isSupportedLanguage(language) || language === this.#current) return;
    this.#current = language;
    this.#storage.set(LANGUAGE_STORAGE_KEY, language);
    const url = new URL(this.#location.href);
    url.searchParams.set('lang', language);
    this.#history.replaceState(this.#history.state, '', url);
    this.#listeners.forEach(listener => listener(language));
  }

  toggle() {
    this.set(this.#current === 'fr' ? 'en' : 'fr');
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }
}
