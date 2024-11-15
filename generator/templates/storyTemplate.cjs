function generateStoryTemplate(componentName, componentType) {
const lowerComponentName = componentName.toLocaleLowerCase()
  
return `
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import ${componentName} from '~/components/${componentType}/${componentName}/${componentName}'

const meta = {
  title: '${componentType}/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof ${componentName}>
  
export default meta
type Story = StoryObj<typeof meta>
  `
}
module.exports = generateStoryTemplate