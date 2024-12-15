import { VariantProps, cva } from "class-variance-authority"

export type SelectVariants = VariantProps<typeof selectVariants>
export const selectVariants = cva(["uppercase tracking-wide font-semibold text-lg mb-4 bg-transparent border-2 rounded border-blue-300 py-5 w-full bg-blue-100 px-2"], {
  compoundVariants: [
    {
      // Compound variants are used to create a new variant by combining 
      // two or more existing variants.
    }
  ],
  defaultVariants: {
    // Default variants are used to define the default state of the component.
  },
  variants: {
    // Variants are used to define the different states of the component.
  }
})
