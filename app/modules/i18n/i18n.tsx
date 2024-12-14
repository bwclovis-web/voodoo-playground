import { serverOnly$ } from "vite-env-only/macros"

import enTranslation from "~/modules/i18n/locales/en"
import esTranslation from "~/modules/i18n/locales/es"
import frTranslation from "~/modules/i18n/locales/fr"
import chTranslation from "~/modules/i18n/locales/zh"

import { Languages } from "./langObj"

export const supportedLngs = [
  "es", "en", "fr", "zh"
]
export const fallbackLng = "en"
export const defaultNS = "translation"
export const languageObj = Languages

export const resources = serverOnly$({
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  fr: { translation: frTranslation },
  zh: { translation: chTranslation }
})
