const path = require("path")

const generateComponentTemplate = require("../templates/componentTemplate.cjs")

const scaffoldFactory = require("./scaffoldFactory.cjs")

const generateTemplate = (name, type) => {
  scaffoldFactory(
    path.join(`app/components/${type}`, name),
    generateComponentTemplate(name),
    `${name}.tsx`
  )
  return true
}

module.exports =  generateTemplate
