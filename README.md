# home

> A Vue.js project

## Build Setup

``` bash
# 安转依赖
npm install

# 启动服务 localhost:8080 page为页面名称，对应config/page.config.js 下面的name项 默认index
npm run dev page

# 配置打包环境
# 1、在config/env.config/下面配置打包文件
{
  NODE_ENV: '"production"', #打包环境
  ENV_CONFIG: '"jmc"',  #打包配置名
  ASSETS_ROOT_PATH: '../../../jiguozhidx/jiguo-dev/cdn/admin@2.0', #生成的静态资源路径
  ASSETS_SUB_DIRECTORY: '', #生成的静态资源目录
  FILENAME_PUBLIC_PATH: '../../jiguozhidx/jiguo-dev'  #生成的主文件路径
}
# 2、在package.json中配置打包命令
  "scripts": {
      "build:环境": "cross-env NODE_ENV=production ENV_CONFIG=环境名 node build/build.js",
    },

# 页面单独打包 (可同时打包多个页面用空格隔开)
npm run build page1 page2 page3

# 打包所有页面，参数在config/page.config.js以及config/index.js下设置
npm run build

# 发布到测试环境只需要把代码push到dev分支即可，测试服jenkins会自动呗webhook触发构建
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
