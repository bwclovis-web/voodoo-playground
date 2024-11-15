// Purpose: Generates a template for a new component.
function generateComponentTemplate(componentName) {
  const lowerComponentName = componentName.toLocaleLowerCase()

  return `import { VariantProps, cva } from "class-variance-authority"
import { FC, HTMLProps } from "react"

import { styleMerge } from "~/utils/styleUtils"

interface ${componentName}Props extends HTMLProps<HTMLDivElement>,
  VariantProps<typeof ${lowerComponentName}Variants> { }

const ${lowerComponentName}Variants = cva("", {
  defaultVariants: {
    // Add default variants here
  },
  variants: {
    // Add variants here
  }
})
const ${componentName}:FC<${componentName}Props> = ({ className, ...props }) => (
  <div
      className={
        styleMerge(${lowerComponentName}Variants({ className }))
      }
      data-cy="${componentName}"
      {...props}
    >
    ${componentName}
  </div>
)
export default ${componentName}  
`
}
module.exports = generateComponentTemplate
