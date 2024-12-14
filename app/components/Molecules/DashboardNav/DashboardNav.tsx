import { NavLink } from "@remix-run/react"
import { VariantProps } from "class-variance-authority"
import { FC, HTMLProps } from "react"

import { styleMerge } from "~/utils/styleUtils"

import { dashboardNavVariants } from "./dashboardnav-variants"

interface DashboardNavProps extends HTMLProps<HTMLDivElement>,
  VariantProps<typeof dashboardNavVariants> { }

const navData = [
  {
    title: "Dashboard",
    href: "/dashboard"
  },
  {
    title: "Settings",
    href: "/dashboard/account/settings"
  },
  {
    title: "Long Call",
    href: "/dashboard/long-call"
  }
]

const DashboardNav: FC<DashboardNavProps> = ({ className, ...props }) => (
  <div
    className={
      styleMerge(dashboardNavVariants({ className }))
    }
    data-cy="DashboardNav"
    {...props}
  >
    <span>DashboardNav</span>
    <ul className="flex gap-4">
      {navData.map((nav, index) => (
        <li key={index}>
          <NavLink
            viewTransition={true}
            to={nav.href}
            className="nav-link"
          >{nav.title}</NavLink>
        </li>
      ))}
    </ul>
  </div>
)
export default DashboardNav  
