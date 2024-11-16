/* eslint-disable max-statements */
/* eslint-disable max-params */
import { PassThrough } from 'node:stream'

import type { AppLoadContext, EntryContext } from '@remix-run/node'
import { createReadableStreamFromReadable } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { createInstance } from 'i18next'
import { isbot } from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { I18nextProvider, initReactI18next } from 'react-i18next'

import { NonceProvider } from '~/hooks/use-nonce'
import * as i18n from '~/modules/i18n/i18n'
import i18nServer from '~/modules/i18n/i18n.server'
import { initEnvs } from '~/utils/utility.server'

initEnvs()

const ABORT_DELAY = 5_000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
) {
  const callbackName = isbot(request.headers.get('user-agent'))
    ? 'onAllReady'
    : 'onShellReady'

  const nonce = String(loadContext.cspNonce) ?? undefined

  const instance = createInstance()
  const lng = await i18nServer.getLocale(request)
  const ns = i18nServer.getRouteNamespaces(remixContext)

  await instance.use(initReactI18next).init({
    ...i18n,
    lng,
    ns,
    resources: i18n.resources
  })

  return new Promise((resolve, reject) => {
    let shellRendered = false
    const { pipe, abort } = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <I18nextProvider i18n={instance}>
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
          />
        </I18nextProvider>
      </NonceProvider>,
      {

        [callbackName]: () => {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set('Content-Type', 'text/html')

          resolve(new Response(stream, {
            headers: responseHeaders,
            status: responseStatusCode
          }))

          pipe(body)
        },
        nonce,
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
