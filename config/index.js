// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var v = 'v1.0.0'

var env_config = require('./env.config')
process.env.ENV_CONFIG = process.env.ENV_CONFIG || ''
var config = {
  page: require('./page.config'),
  build: {
    ...env_config,
		assetsRoot: path.resolve(__dirname, env_config[process.env.ENV_CONFIG + 'Env']['ASSETS_ROOT_PATH']),
		// assetsRoot: path.resolve(__dirname, '../../../jiguozhidx/jiguo-dev/cdn/admin@2.0'),
		assetsSubDirectory: env_config[process.env.ENV_CONFIG + 'Env']['ASSETS_SUB_DIRECTORY'] || '',
		assetsPublicPath: 'http://cdn.jiguo.com/admin@2.0/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./env.config/dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: {
      '/api/html': {
        target: 'http://new.jiguo.com',
        secure: true,
        changeOrigin: true
      },
      '/api': {
        target: 'http://new.jiguo.com',
        secure: true,
        changeOrigin: true
      },
      '/mb/ajax': {
        target: 'http://new.jiguo.com',
        secure: true,
        changeOrigin: true
      },
      '/mb/api': {
        target: 'http://new.jiguo.com',
        secure: true,
        changeOrigin: true
      },
      '/wxcode': {
        target: 'https://wx.jiguo.com',
        secure: true,
        changeOrigin: true
      },
      '/protected': {
        target: 'http://dev.jiguo.com',
        secure: true,
        changeOrigin: true
      },
      '/cdn': {
        target: 'http://cdn.jiguo.com',
        secure: true,
        pathRewrite: {
          '^/cdn': '/'
        },
        changeOrigin: true
      },
      '/UEditor/php': {
        target: 'http://dev.jiguo.com',
        secure: true,
        pathRewrite: {
          '^/UEditor/php': '/protected/extensions/editor/php'
        },
        changeOrigin: true
      },
			'/admin': {
				target: 'http://dev.jiguo.com',
				secure: true,
				changeOrigin: true
			}
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
// console.log(config.page)
// return
module.exports = config
