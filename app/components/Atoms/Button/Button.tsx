import { NavLink } from "@remix-run/react"
import { VariantProps } from "class-variance-authority"
import { ButtonHTMLAttributes, FC, LinkHTMLAttributes } from "react"

import { styleMerge } from "~/utils/styleUtils"

import { buttonVariants } from "./button-variants"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> { }

interface LinkProps extends LinkHTMLAttributes<HTMLAnchorElement>,
  VariantProps<typeof buttonVariants> {
  url: string
}

const Button: FC<ButtonProps> = ({ className, size, intent, ...props }) => (
  <button className={
    styleMerge(buttonVariants({ className, intent, size }))
  } {...props} />
)

const Link: FC<LinkProps> = ({ className, size, intent, url, ...props }) => (
  <NavLink
    to={url}
    prefetch="intent"
    className={
      styleMerge(buttonVariants({ className, intent, size }))
    } {...props} />
)

export { Button, Link, buttonVariants }
