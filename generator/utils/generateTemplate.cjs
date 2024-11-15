const path = require("path")
const pColor = require('picocolors')
const generateComponentTemplate = require("../templates/componentTemplate.cjs")
const scaffoldFactory = require("./scaffoldFactory.cjs")

const generateTemplate = (name, type) => {
   const componentPath = scaffoldFactory(
    path.join(`app/components/${type}`, name),
    generateComponentTemplate(name),
    `${name}.tsx`
  )

  if(componentPath) {
    console.log('👍', pColor.green(`Component ${name} created successfully`))
    console.log('📁', pColor.bgGreenBright(`Component available in ${componentPath}`))
  }
  return true
}

module.exports =  generateTemplate
