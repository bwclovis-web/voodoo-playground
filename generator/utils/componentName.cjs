const { input } = require('@inquirer/prompts')
const pColor = require('picocolors')

const generateTemplate = require( './generateTemplate.cjs')

const nameFormat = new RegExp(/^((?:[\w-]+\/)*)([A-Z][\w-]+)$/)
const componentName = (type) => {
  input({
    message: `What is the name of the ${pColor.greenBright(pColor.bold(type))}?`,
    required: true,
    // eslint-disable-next-line max-statements
    validate: (value) => {
      const match = value.match(nameFormat)
      if (value.length < 3) {
        return `${pColor.bgRed(pColor.white('Name must be at least 3 characters long'))}`
      }
      if (!match) {
        return `${pColor.bgRed(pColor.white('Name must be in PascalCase'))}`
      }
      return true
    }
  }).then(name => {
    generateTemplate(name, type)
  }).catch(console.error)
}

module.exports = { componentName }
