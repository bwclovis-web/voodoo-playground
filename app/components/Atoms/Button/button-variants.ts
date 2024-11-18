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
      home: "bg-pink-600/10 max-w-max items-center gap-2 p-2 border-transparent hover:bg-pink-600/30 border border-white transition-colors",
      primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
      secondary: "bg-white text-gray-800 border-gray-400 hover:bg-gray-100 "
    },
    size: {
      medium: ["text-base", "py-2", "px-4"],
      small: ["text-sm", "py-1", "px-2"]
    }
  }
})
