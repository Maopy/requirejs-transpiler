const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
const glob = require('glob')
const { parse } = require('babylon')
const generate = require('babel-generator').default
const t = require('babel-types')

const srcBasePath = path.resolve(__dirname, '../example/src')
const srcPath = `${srcBasePath}/**/*.js`
const distBasePath = `${path.resolve(__dirname, '../example/dist')}`
const ignoreDependencies = new Set(['raven'])

const srcFiles = glob.sync(srcPath)
srcFiles.forEach((fileName) => {
  let fileTailPath = fileName.slice(srcBasePath.length, -3)
  let code = readFileSync(fileName, 'utf-8')
  let ast = parse(code, {
    sourceType: 'module'
  })
  let programBody = []

  ast.program.body.forEach((node) => {
    if (t.isExpressionStatement(node)) {
      if (t.isCallExpression(node.expression)) {
        if (node.expression.callee.name === 'define') {
          // handle dependencies
          let dependenciesNodes = node.expression.arguments[0]
          let dependencies = []
          if (t.isArrayExpression(dependenciesNodes)) {
            dependenciesNodes.elements.forEach((dependence) => {
              if (t.isStringLiteral(dependence)) {
                dependencies.push(dependence.value)
              }
            })
          }

          // handle params received
          let definitionFunc = node.expression.arguments[1]
          let parameters = []
          let moduleCodes = {}
          if (t.isFunctionExpression(definitionFunc)) {
            definitionFunc.params.forEach((param) => {
              if (t.isIdentifier(param)) {
                parameters.push(param.name)
              }
            })
          }
          if (t.isBlockStatement(definitionFunc.body)) {
            moduleCodes = definitionFunc.body.body
          }

          // generate codes
          let paramIdx = 0
          dependencies.forEach((dependence, idx) => {
            if (!ignoreDependencies.has(dependence) && paramIdx < parameters.length) {
              programBody.push(t.importDeclaration([
                  t.importDefaultSpecifier(t.identifier(parameters[paramIdx]))
                ],
                t.stringLiteral(dependence)
              ))
              paramIdx++
            } else {
              programBody.push(t.importDeclaration([], t.stringLiteral(dependence)))
            }
          })

          moduleCodes.forEach((node) => {
            if (t.isReturnStatement(node)) {
              programBody.push(
                t.exportDefaultDeclaration(node.argument)
              )
            } else {
              programBody.push(node)
            }
          })
        }
      }
    } else {
      programBody.push(node)
    }
  })

  let esFile = t.file(t.program(programBody), ast.comments, ast.tokens)

  let output = generate(esFile).code
  
  writeFileSync(`${distBasePath}${fileTailPath}.ast`, JSON.stringify(ast))
  writeFileSync(`${distBasePath}${fileTailPath}.js`, output)
})
