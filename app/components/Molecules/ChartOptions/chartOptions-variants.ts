import { VariantProps, cva } from "class-variance-authority"

export type ChartOptionsVariants = VariantProps<typeof chartOptionsVariants>
export const chartOptionsVariants = cva([""], {
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
