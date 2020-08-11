var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"jenkins"',
  ASSETS_ROOT_PATH: '../dist',
  ASSETS_SUB_DIRECTORY: 'static',
})
