import { UI_STRINGS } from './strings.js';

function interpolate(template, variables) {
  return template.replace(/\{(\w+)\}/g, (match, key) => variables[key] ?? match);
}

// `t` reads interface strings by key; `pick` reads inline { fr, en } content values.
export function createTranslator(languageService, strings = UI_STRINGS) {
  return {
    get language() {
      return languageService.current;
    },
    t(key, variables = {}) {
      const template = strings[languageService.current]?.[key] ?? strings.fr[key] ?? key;
      return interpolate(template, variables);
    },
    pick(value) {
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') return value;
      return value[languageService.current] ?? value.fr;
    },
  };
}
