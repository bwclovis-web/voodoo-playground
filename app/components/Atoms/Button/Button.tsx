import { NavLink } from "@remix-run/react"
import { VariantProps } from "class-variance-authority"
import { ButtonHTMLAttributes, FC, LinkHTMLAttributes } from "react"

import { styleMerge } from "~/utils/styleUtils"

import { buttonVariants } from "./button-variants"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> { }

interface LinkProps extends LinkHTMLAttributes<HTMLAnchorElement>,
  VariantProps<typeof buttonVariants> {
  url: {
    pathname: string
    search?: string
  }
}

const Button: FC<ButtonProps> = ({ className, size, variant, ...props }) => (
  <button className={
    styleMerge(buttonVariants({ className, size, variant }))
  } {...props} />
)

const CustomLink: FC<LinkProps> = ({
  className, size, variant, url, ...props }) => (
  <NavLink
    to={url}
    prefetch="intent"
    className={
      styleMerge(buttonVariants({ className, size, variant }))
    } {...props} />
)

export { Button, CustomLink, buttonVariants }
