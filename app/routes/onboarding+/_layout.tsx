import { Outlet } from "@remix-run/react"

export const ROUTE_PATH = '/onboarding'


const Account = () => (
  <div>
    <div className="z-10 h-screen w-screen">
      <Outlet />
    </div>
  </div>
)

export default Account
