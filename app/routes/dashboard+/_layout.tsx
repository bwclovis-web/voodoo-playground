import { LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Outlet } from "@remix-run/react"

import { fetchUser } from "~/models/user.server"

import { ROUTE_PATH as ACCOUNT_SETUP_PATH } from "../onboarding+/setup"
export const ROUTE_PATH = '/dashboard' as const


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await fetchUser(request, '')
  if (!user.password) {
    return redirect(ACCOUNT_SETUP_PATH)
  }

  return { user }
}

const DashboardLayout = () => (
  <div className="bg-slate-200 h-full">
    <div className="mx-auto flex gap-6 h-full">
      <div className="py-6 overflow-hidden"><Outlet /></div>
    </div>
  </div>
)

export default DashboardLayout
