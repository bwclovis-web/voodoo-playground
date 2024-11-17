/* eslint-disable camelcase */
import { vitePlugin as remix } from "@remix-run/dev"
import { defineConfig } from "vite"
import { envOnlyMacros } from "vite-env-only"
import tsconfigPaths from "vite-tsconfig-paths"
import { flatRoutes } from 'remix-flat-routes'

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    envOnlyMacros(),
    remix({
      ignoredRouteFiles: ['**/.*'],
      routes: async (defineRoutes) => {
        return flatRoutes('routes', defineRoutes)
      },
      future: {
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_singleFetch: true,
        v3_throwAbortReason: true,
      }
    }),
    tsconfigPaths()
  ]
})
