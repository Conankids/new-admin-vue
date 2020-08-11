var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"jmc"',
  ASSETS_ROOT_PATH: '../../../jiguozhidx/jiguo-dev/cdn/admin@2.0',
  ASSETS_SUB_DIRECTORY: '',
  FILENAME_PUBLIC_PATH: '../../jiguozhidx/jiguo-dev'
})
