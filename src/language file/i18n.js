import en from "./en.json";
import my from "./my.json";

const dict = { en, my };

export function t(lang, key) {
  return key.split(".").reduce((obj, k) => obj?.[k], dict[lang]) ?? key;
}
