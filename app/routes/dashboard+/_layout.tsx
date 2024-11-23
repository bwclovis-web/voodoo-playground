import { LoaderFunctionArgs, redirect } from "@remix-run/node"

import { fetchUser } from "~/models/user.server"

import { ROUTE_PATH as ACCOUNT_SETUP_PATH } from "../onboarding+/setup"
export const ROUTE_PATH = '/dashboard' as const


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await fetchUser(request, null)
  console.log(`%c USER`, 'background: #0047ab; color: #fff; padding: 2px:', user)
  if (!user.password) {
    return redirect(ACCOUNT_SETUP_PATH)
  }

  return {}
}
const DashboardLayout = () => (
  <div>
    <h1>Dashboard</h1>
  </div>
)

export default DashboardLayout
