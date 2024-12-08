import { serverOnly$ } from "vite-env-only/macros"

import enTranslation from "~/modules/i18n/locales/en"
import esTranslation from "~/modules/i18n/locales/es"

import { Languages } from "./langObj"

export const supportedLanguages = [
  "es", "en"
]
export const fallbackLng = "en"
export const defaultNS = "translation"
export const languageObj = Languages

export const resources = serverOnly$({
  en: { translation: enTranslation },
  es: { translation: esTranslation },
})
