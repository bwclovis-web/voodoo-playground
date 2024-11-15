import { VariantProps, cva } from "class-variance-authority"
import { FC, HTMLProps } from "react"

import { styleMerge } from "~/Utils/utils"

interface ButtonProps extends HTMLProps<HTMLDivElement>,
  VariantProps<typeof buttonVariants> { }

const buttonVariants = cva("", {
  defaultVariants: {
    // Add default variants here
  },
  variants: {
    // Add variants here
  }
})
const Button:FC<ButtonProps> = ({ className, ...props }) => (
  <div
      className={
        styleMerge(buttonVariants({ className }))
      }
      data-cy="Button"
      {...props}
    >
    Button
  </div>
)
export default Button  
