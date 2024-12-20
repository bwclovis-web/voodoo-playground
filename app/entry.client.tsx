/* eslint-disable import/no-named-as-default-member */
import { RemixBrowser } from "@remix-run/react"
import i18next from "i18next"
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector"
import Fetch from "i18next-fetch-backend"
import { startTransition } from "react"
import { hydrateRoot } from "react-dom/client"
import { I18nextProvider, initReactI18next } from "react-i18next"
import { getInitialNamespaces } from "remix-i18next/client"

import { defaultNS, fallbackLng, supportedLngs } from "~/modules/i18n/i18n"

import { ChartProvider } from "./providers/chartCtx"

async function main() {
  await i18next
    .use(initReactI18next)
    .use(Fetch)
    .use(I18nextBrowserLanguageDetector)
    .init({
      backend: {
        loadPath: "/api/locales?lng={{lng}}&ns={{ns}}"
      },
      defaultNS,
      detection: {
        caches: [],
        order: ["htmlTag"]
      },
      fallbackLng,
      ns: getInitialNamespaces(),
      supportedLngs
    })

  startTransition(() => {
    hydrateRoot(
      document,
      <ChartProvider>
        <I18nextProvider i18n={i18next}>
          <RemixBrowser />
        </I18nextProvider>
      </ChartProvider>

    )
  })
}

main().catch(error => console.error(error))
