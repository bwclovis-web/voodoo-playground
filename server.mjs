/* eslint-disable no-console */
import process from 'node:process'

import prom from "@isaacs/express-prometheus-middleware"
import { createRequestHandler } from "@remix-run/express"
import { installGlobals } from "@remix-run/node"
import express from "express"
import morgan from 'morgan'

installGlobals()
const metricsPort = process.env.METRICS_PORT || 3030
const port = process.env.APP_PORT || 5150

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then(vite => vite.createServer({
          server: { middlewareMode: true }
        }))

const app = express()
const metricsApp = express()

if (viteDevServer) {
  app.use(viteDevServer.middlewares)
} else {
  app.use(
    "/assets",
    express.static("build/client/assets", {
      immutable: true,
      maxAge: "1y"
    })
  )
}
app.use(express.static("build/client", { maxAge: "1h" }))
app.disable('x-powered-by')
// Prometheus
app.use(prom({
  collectDefaultMetrics: true,
  metricsApp,
  metricsPath: "/metrics"
}))

app.use(morgan('tiny'))

// handle SSR requests
app.all(
  "*",
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
      : await import("./build/server/index.js")
  })
)


app.listen(port, () => console.log(`🤘 server running: http://localhost:${port}`))
metricsApp.listen(metricsPort, () => console.log(`✅ metrics ready: http://localhost:${metricsPort}/metrics`))
