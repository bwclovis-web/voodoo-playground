import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

import { auth } from '~/modules/auth/auth.server'
import { ROUTE_PATH as LOGIN_PATH } from '~/routes/auth+/account-create'
import { ROUTE_PATH as DASHBOARD_PATH } from '~/routes/dashboard+/_index'
import { getDomainPathname } from '~/utils/server/utility.server'

export const ROUTE_PATH = '/auth' as const

export async function loader({ request }: LoaderFunctionArgs) {
  await auth.isAuthenticated(request, {
    successRedirect: DASHBOARD_PATH
  })
  const pathname = getDomainPathname(request)
  if (pathname === ROUTE_PATH) {
    return redirect(LOGIN_PATH)
  }
  return {}
}


export default function Layout() {
  return (
    <div className="flex h-full w-full flex-col border-l border-primary/5 bg-card lg:w-[50%]">
      <Outlet />
    </div>
  )
}
