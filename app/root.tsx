import { LinksFunction, LoaderFunctionArgs, data } from "@remix-run/node"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react"

import stylesheet from "~/styles/tailwind.css?url"

import { useNonce } from "./hooks/use-nonce"
import i18nServer, { localeCookie } from "./modules/i18n/i18n.server"

export const links: LinksFunction = () => [{ href: stylesheet, rel: "stylesheet" }]

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18nServer.getLocale(request)
  return data(
    { locale },
    { headers: { "Set-Cookie": await localeCookie.serialize(locale) } }
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const nonce = useNonce()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
