import { type LoaderFunctionArgs, json } from "@remix-run/node"
import { cacheHeader } from "pretty-cache-header"
import { z } from "zod"

import { resources } from "~/modules/i18n/i18n"

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const languages = resources!

  const lng = parseLanguage(url.searchParams.get("lng"), languages)
  const namespaces = languages[lng]
  const namespace = parseNamespace(url.searchParams.get("ns"), namespaces, languages, lng)

  return createJsonResponse(namespaces, namespace)
}

function createJsonResponse(
  namespaces: typeof resources[keyof typeof resources],
  namespace: string
) {
  const headers = createHeaders()
  return json(namespaces[namespace], { headers })
}

function parseLanguage(lngParam: string | null, languages: typeof resources) {
  return z
    .string()
    .refine((lng): lng is keyof typeof languages => {
      if (!languages) {
        throw new Error("Languages is undefined")
      }
      return Object.keys(languages).includes(lng)
    })
    .parse(lngParam)
}

function parseNamespace(
  nsParam: string | null,
  namespaces: typeof resources[keyof typeof resources],
  languages: typeof resources,
  lng: keyof typeof resources
) {
  return z
    .string()
    .refine((namespace): namespace is string => {
      if (!languages) {
        throw new Error("Languages is undefined")
      }
      return Object.keys(languages[lng]).includes(namespace)
    })
    .parse(nsParam)
}

function createHeaders() {
  const headers = new Headers()

  // On production, we want to add cache headers to the response
  if (process.env.NODE_ENV === "production") {
    headers.set(
      "Cache-Control",
      cacheHeader({
        maxAge: "5m", // Cache in the browser for 5 minutes
        sMaxage: "1d", // Cache in the CDN for 1 day
        staleIfError: "7d",
        staleWhileRevalidate: "7d"
      })
    )
  }

  return headers
}
