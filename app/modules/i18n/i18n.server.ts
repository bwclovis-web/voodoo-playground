
import { resolve } from "node:path"

import { createCookie } from "@remix-run/node"
import { RemixI18Next } from "remix-i18next/server"

import * as i18n from "~/modules/i18n/i18n"

export const localeCookie = createCookie("lng", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
})

export default new RemixI18Next({
  detection: {
    cookie: localeCookie,
    fallbackLanguage: i18n.fallbackLng,
    supportedLanguages: i18n.supportedLanguages
  },
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json")
    }
  }
})
