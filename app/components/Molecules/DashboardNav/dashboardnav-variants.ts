import { VariantProps, cva } from "class-variance-authority"

export type DashboardNavVariants = VariantProps<typeof dashboardNavVariants>
export const dashboardNavVariants = cva(["flex justify-between px-6 bg-blue-200 py-4"], {
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
