import { resolve } from "path"

import { createCookie } from "@remix-run/node"
import Backend from "i18next-fs-backend"
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
    supportedLanguages: i18n.supportedLngs
  },
  i18next: {
    ...i18n
  },
  plugins: [Backend]
})
