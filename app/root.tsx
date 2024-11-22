import { LinksFunction, LoaderFunctionArgs, data } from "@remix-run/node"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react"
import { ReactNode } from "react"
import { useChangeLanguage } from "remix-i18next/react"
import { AuthenticityTokenProvider } from "remix-utils/csrf/react"

import stylesheet from "~/styles/tailwind.css?url"

import { useNonce } from "./hooks/use-nonce"
import i18nServer, { localeCookie } from "./modules/i18n/i18n.server"
import { csrf } from "./utils/server/csrf.server"
import { mergeHeaders } from "./utils/server/utility.server"

export const handle = { i18n: ["translation"] }
export const links: LinksFunction = () => [{ href: stylesheet, rel: "stylesheet" }]

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18nServer.getLocale(request)
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken()
  return data(
    { csrfToken, locale },
    {
      headers: mergeHeaders(
        { "Set-Cookie": await localeCookie.serialize(locale) },
        csrfCookieHeader ? { 'Set-Cookie': csrfCookieHeader } : null
      )
    }
  )
}

type DocumentType = {
  children: ReactNode
  nonce: string
  lang?: string
  dir?: "ltr" | "rtl"
}

const Document = ({ children, dir = 'ltr', lang = ' en', nonce }: DocumentType) => (
  <html
    lang={lang}
    dir={dir}
    className={`overflow-x-hidden h-full`}
  >
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body className="h-full">
      {children}
      <ScrollRestoration nonce={nonce} />
      <Scripts nonce={nonce} />
    </body>
  </html>
)

export function Layout() {
  const { csrfToken, locale } = useLoaderData<typeof loader>()
  const nonce = useNonce()
  useChangeLanguage(locale)
  return (
    <Document lang={locale ?? "en"} nonce={nonce}>
      <AuthenticityTokenProvider token={csrfToken}>
        <Outlet />
      </AuthenticityTokenProvider>

    </Document>
  )
}

export default Layout
