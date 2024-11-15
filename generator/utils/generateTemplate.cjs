const path = require("path")
const pColor = require('picocolors')
const generateComponentTemplate = require("../templates/componentTemplate.cjs")
const generateStoryTemplate = require("../templates/storyTemplate.cjs")
const scaffoldFactory = require("./scaffoldFactory.cjs")

const generateTemplate = (name, type) => {

   const componentPath = scaffoldFactory(
    path.join(`app/components/${type}`, name),
    generateComponentTemplate(name),
    `${name}.tsx`
  )

  const storyPath = scaffoldFactory(
    path.join(`stories/${type}`, name),
    generateStoryTemplate(name, type),
    `${name}.stories.ts`
  )


  if(componentPath) {
    console.log('👍', pColor.green(`Component ${name} created successfully`))
    console.log('📁', pColor.bgGreenBright(`Component available in ${componentPath}`))
  }
  if(storyPath) {
    console.log('📁', pColor.bgGreenBright(`Component available in ${storyPath}`))
  }
  return true
}

module.exports =  generateTemplate
