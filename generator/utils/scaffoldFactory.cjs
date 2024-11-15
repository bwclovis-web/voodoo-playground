const fs = require('fs')
const path = require('path')

const editLineEndings = (str) => str.replace(/\r|\n/gm, '\r\n')

const scaffoldFactory = (
  root,
  componentData,
  file
) => {
  const outputFie = path.join(root, file)
  fs.mkdirSync(root, { recursive: true })
  fs.writeFileSync(outputFie, editLineEndings(componentData), 'utf8')
  return true
}

module.exports = scaffoldFactory
