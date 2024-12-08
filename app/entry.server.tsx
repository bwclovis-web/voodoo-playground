/* eslint-disable max-params */
import { PassThrough } from "node:stream"

import type { AppLoadContext, EntryContext } from "@remix-run/node"
import { createReadableStreamFromReadable } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import { createInstance, i18n as i18next } from "i18next"
import { isbot } from "isbot"
import { renderToPipeableStream } from "react-dom/server"
import { I18nextProvider, initReactI18next } from "react-i18next"

import { NonceProvider } from '~/hooks/use-nonce'
import * as i18n from "~/modules/i18n/i18n"
import i18nServer from "~/modules/i18n/i18n.server"
import { initEnvs } from '~/utils/server/utility.server'

initEnvs()

const ABORT_DELAY = 5000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
) {
  const instance = createInstance()
  const lng = await i18nServer.getLocale(request)
  const ns = i18nServer.getRouteNamespaces(remixContext)

  await instance.use(initReactI18next).init({ ...i18n, lng, ns })

  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext,
      loadContext,
      instance
    )
    : handleBrowserRequest(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext,
      loadContext,
      instance
    )
}

async function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
  i18next: i18next
) {
  const nonce = String(loadContext.cspNonce) ?? undefined
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const { pipe, abort } = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <I18nextProvider i18n={i18next}>
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
            nonce={nonce}
          />
        </I18nextProvider>
      </NonceProvider>,
      {
        onAllReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set("Content-Type", "text/html")

          resolve(new Response(stream, {
            headers: responseHeaders,
            status: responseStatusCode
          }))

          pipe(body)
        },
        onError(error: unknown) {
          responseStatusCode = 500
          if (shellRendered) {
            console.error(error)
          }
        },
        onShellError(error: unknown) {
          reject(error)
        }
      }
    )

    setTimeout(abort, ABORT_DELAY)
  })
}

async function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
  i18next: i18next
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const nonce = String(loadContext.cspNonce) ?? undefined
    const { pipe, abort } = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <I18nextProvider i18n={i18next}>
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
            nonce={nonce}
          />
        </I18nextProvider>
      </NonceProvider>,
      {
        onError(error: unknown) {
          responseStatusCode = 500
          if (shellRendered) {
            console.error(error)
          }
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onShellReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set("Content-Type", "text/html")

          resolve(new Response(stream, {
            headers: responseHeaders,
            status: responseStatusCode
          }))

          pipe(body)
        }
      }
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
