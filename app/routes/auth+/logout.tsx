import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

import { auth } from '~/modules/auth/auth.server'

export const ROUTE_PATH = '/auth/logout' as const

export async function loader({ request }: LoaderFunctionArgs) {
  return auth.logout(request, { redirectTo: '/' })
}

export async function action({ request }: ActionFunctionArgs) {
  return auth.logout(request, { redirectTo: '/' })
}
