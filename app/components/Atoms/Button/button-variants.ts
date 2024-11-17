import { VariantProps, cva } from "class-variance-authority"

export type ButtonVariants = VariantProps<typeof buttonVariants>
export const buttonVariants = cva([""], {
  compoundVariants: [
    {
      class: "uppercase",
      intent: "primary",
      size: "medium"
    }
  ],
  defaultVariants: {
    intent: "primary",
    size: "medium"
  },
  variants: {
    intent: {
      primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
      secondary: "bg-white text-gray-800 border-gray-400 hover:bg-gray-100"
    },
    size: {
      medium: ["text-base", "py-2", "px-4"],
      small: ["text-sm", "py-1", "px-2"]
    }
  }
})
