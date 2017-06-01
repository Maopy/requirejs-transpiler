const { transpile } = require('./index')
const path = require('path')

transpile({
  srcBasePath: path.resolve(__dirname, './example/src'),
  srcPattern: '/**/*.js',
  distBasePath: path.resolve(__dirname, './example/dist'),
  ignoreDependencies: ['raven']
})
