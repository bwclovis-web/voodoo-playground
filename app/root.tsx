import { LinksFunction, LoaderFunctionArgs, data } from "@remix-run/node"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData
} from "@remix-run/react"
import { useChangeLanguage } from "remix-i18next/react"
import { AuthenticityTokenProvider } from "remix-utils/csrf/react"
import { HoneypotProvider } from "remix-utils/honeypot/react"

import stylesheet from "~/styles/tailwind.css?url"

import { useNonce } from "./hooks/use-nonce"
import i18nServer, { localeCookie } from "./modules/i18n/i18n.server"
import { csrf } from "./utils/server/csrf.server"
import { honeypot } from "./utils/server/honeypot.server"
import { mergeHeaders } from "./utils/server/utility.server"

export const handle = { i18n: ["translation"] }
export const links: LinksFunction = () => [{ href: stylesheet, rel: "stylesheet" }]

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18nServer.getLocale(request)
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken()
  return data(
    { csrfToken, honeypotProps: honeypot.getInputProps(), locale } as const,
    {
      headers: mergeHeaders(
        { "Set-Cookie": await localeCookie.serialize(locale) },
        csrfCookieHeader ? { 'Set-Cookie': csrfCookieHeader } : null
      )
    }
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const nonce = useNonce()
  const loaderData = useRouteLoaderData<typeof loader>("root")

  return (
    <html lang={loaderData?.locale ?? "en"} className="h-full">
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
}

export default function App() {
  const { csrfToken, locale, honeypotProps } = useLoaderData<typeof loader>()
  useChangeLanguage(locale)
  return (<AuthenticityTokenProvider token={csrfToken}>
    <HoneypotProvider {...honeypotProps}>
      <Layout>
        <Outlet />
      </Layout>
    </HoneypotProvider>
  </AuthenticityTokenProvider>
  )
}
