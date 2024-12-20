/* eslint-disable no-console */
import crypto from 'crypto'
import http from 'http'
import process from 'node:process'

import prom from '@isaacs/express-prometheus-middleware'
import { createRequestHandler } from '@remix-run/express'
import { installGlobals } from '@remix-run/node'
import compression from 'compression'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
// import helmet from 'helmet'
import morgan from 'morgan'
import os from 'os-utils'
import { Server } from 'socket.io'

installGlobals()
const METRICS_PORT = process.env.METRICS_PORT || 3030
const PORT = process.env.APP_PORT || 2112
const NODE_ENV = process.env.NODE_ENV ?? 'development'
const MAX_LIMIT_MULTIPLE = NODE_ENV !== 'production' ? 10_000 : 1

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then(vite => vite.createServer({
          server: { middlewareMode: true }
        }))

const defaultRateLimit = {
  legacyHeaders: false,
  max: 1000 * MAX_LIMIT_MULTIPLE,
  standardHeaders: true,
  windowMs: 60 * 1000
}

const strongestRateLimit = rateLimit({
  ...defaultRateLimit,
  max: 10 * MAX_LIMIT_MULTIPLE,
  windowMs: 60 * 1000
})

const strongRateLimit = rateLimit({
  ...defaultRateLimit,
  max: 100 * MAX_LIMIT_MULTIPLE,
  windowMs: 60 * 1000
})
const generalRateLimit = rateLimit(defaultRateLimit)

const app = express()
const metricsApp = express()
const server = http.createServer(app)
const io = new Server(server)

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
app.use(compression())
app.use(morgan('tiny'))

// Prometheus
app.use(prom({
  collectDefaultMetrics: true,
  metricsApp,
  metricsPath: "/metrics"
}))

app.use((_, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
  next()
})

// app.use(helmet({
//   contentSecurityPolicy: {
//     crossOriginEmbedderPolicy: false,
//       directives: {
//         'connect-src': [ NODE_ENV === 'development' ? 'ws:' : null, "'self'" ].filter(Boolean),
//         'font-src': [ "'self'" ],
//         'frame-src': [ "'self'" ],
//         'img-src': [ "'self'", 'data:' ],
//         'script-src': [
//           "'strict-dynamic'",
//           "'self'",
//           (_, res) => `'nonce-${res.locals.cspNonce}'`
//         ],
//         'script-src-attr': [ (_, res) => `'nonce-${res.locals.cspNonce}'` ],
//         'upgrade-insecure-requests': null
//       },
//       // ❗Important: Remove `reportOnly` to enforce CSP. (Development only).
//       referrerPolicy: { policy: 'same-origin' },
//       reportOnly: true
//     }
//   }))

// Clean paths with trailing slashes
app.use((req, res, next) => {
  if (req.path.endsWith('/') && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    const safePath = req.path.slice(0, -1).replace(/\/+/g, '/')
    res.redirect(301, safePath + query)
  } else {
    next()
  }
})

// eslint-disable-next-line complexity
app.use((req, res, next) => {
  const STRONG_PATHS = [ '/auth/login' ]
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (STRONG_PATHS.some(path => req.path.includes(path))) {
      return strongestRateLimit(req, res, next)
    }
    return strongRateLimit(req, res, next)
  }
  return generalRateLimit(req, res, next)
})

// handle SSR requests
app.all(
  "*",
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
      : await import("./build/server/index.js"),
    getLoadContext: (_, res) => ({
      cspNonce: res.locals.cspNonce
    })
  })
)

io.on('connection', socket => {

  socket.on('join', data => {
    console.log(data)
  })
  setInterval(() => {
    os.cpuUsage(thing => {
      socket.emit("cpu", {
        'cpuUse': thing,
        'freeMem': os.freemem(),
        'memUse': (os.totalmem() - os.freemem()) / os.totalmem(),
        name: 'cpu',
        'timestamp': new Date().getTime(),
        'totalMem': os.totalmem(),
        'usedMem': os.totalmem() - os.freemem()
      })
    })
  }, 1000)
})
server.listen(PORT, () => console.log(`🤘 server running: http://localhost:${PORT}`))
metricsApp.listen(METRICS_PORT, () => console.log(`✅ metrics ready: http://localhost:${METRICS_PORT}/metrics`))
