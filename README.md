# nuxt-koa-mongodb

> 在 Nuxt.js(基于 Vue.js 的服务端渲染应用框架，koa 作为服务端框架)的基础上，整合第三方模块，如@nuxtjs/axios，@nuxtjs/pwa 等，数据库采用 mongodb，搭建一个基础的全栈框架。

## 前期准备

- 安装 MongoDB：[https://www.mongodb.com/download-center/community](https://www.mongodb.com/download-center/community)
- 安装 MongoDB Compass(可视化工具)：[https://www.mongodb.com/download-center/compass?jmp=docs](https://www.mongodb.com/download-center/compass?jmp=docs)
- 安装 Nodejs：[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

```bash
# 软件版本如下：
# MongoDB - v4.2.1
# MongoDB Compass - v1.19.12(Stable)
# Nodejs - v10.17.0(includes npm v6.11.3)， 最新版本为v12.13.0(includes npm v6.12.0)
```

## 创建项目

```bash
# 通过脚手架工具 create-nuxt-app 创建项目
$ npx create-nuxt-app nuxt-koa-mongodb

# 创建项目时的选择如下：
# 服务器端框架 - koa
# UI框架 - none
# 测试框架 - none
# Nuxt模式 (Universal or SPA) - Universal(SSR)
# 第三方模块 - axios，pwa
# 代码规范和错误检查 - Eslint

# 以开发模式启动带热加载特性的 Nuxt 服务，在localhost:3000查看
$ cd <project-name>
$ npm run dev

# 编译构建，服务端渲染应用部署
$ npm run build
$ npm run start

# 静态应用部署
$ npm run generate
```

## @nuxtjs/axios 扩展

> 文档地址：[https://axios.nuxtjs.org/](https://axios.nuxtjs.org/)

```js
// nuxt.config.js
axios: {
  proxy: true,
  debug: false,
  baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT ||
    3000}`
},
proxy: {
  '/api': 'http://localhost:3000'
},

// plugins/axios.js
export default ({ $axios, redirect }) => {
  // 请求拦截器
  $axios.onRequest((config) => {
    // eslint-disable-next-line no-console
    console.log('Making request to ' + config.url)
    return config
  })

  // 响应拦截器
  $axios.onResponse((resp) => {
    return Promise.resolve(resp.data)
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
    if (code === 500) {
      redirect('/500')
    }
    // 请求不会就此结束，会继续传到then中，即无论请求成功还是失败，在成功的回调中都能收到通知
    return Promise.resolve(error)
  })
}
```

## @nuxtjs/pwa 扩展

> 文档地址：[https://pwa.nuxtjs.org/](https://pwa.nuxtjs.org/)

```js
// 安装@nuxtjs/workbox
$ npm i @nuxtjs/workbox

// nuxt.config.js
manifest: {
  name: 'Nuxt Koa Mongodb',
  short_name: 'Framework',
  lang: 'en',
  display: 'fullscreen',
  start_url: '/',
  theme_color: '#42d69c',
  background_color: '#fff',
  icons: [
    {
      src: '/icon.png',
      sizes: '180x180',
      type: 'image/png'
    }
  ]
},
workbox: {
  dev: true, // 开发人员模式下启用
  config: {
    debug: true // 是否打开调试
  },
  cacheNames: {
    prefix: 'm',
    suffix: process.env.npm_package_version,
    precache: 'custom-precache-name',
    runtime: 'custom-runtime-name'
  },
  cacheOptions: {
    cacheId: process.env.npm_package_name,
    revision: process.env.npm_package_version
  },
  preCaching: [
    '/favicon.ico'
  ],
  runtimeCaching: [
    {
      // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
      urlPattern: 'https://jsonplaceholder.typicode.com/*',
      // Defaults to `networkFirst` if omitted
      handler: 'networkFirst',
      // Defaults to `GET` if omitted
      method: 'GET'
    }
  ]
}
```

配置效果展示：如图所示，更改了缓存的名称
![配置效果展示](https://github.com/zptime/resources/blob/master/images/nuxt-pwa-cache.png)

## koa-router配置

> 文档地址：[https://github.com/ZijianHe/koa-router](https://github.com/ZijianHe/koa-router)

- [koa-json](https://github.com/koajs/json)：美观地输出JSON response的Koa中间件
- [koa-bodyparser](https://github.com/koajs/bodyparser)：Koa没有内置Request Body的解析器，当需要解析请求体时，就要额外加载该中间件了，它支持x-www-form-urlencoded, application/json等格式的请求体，但不支持form-data的请求体。
- [koa-router]((https://github.com/ZijianHe/koa-router))：koa路由中间件

```js
// 安装相应文件
$ npm install koa-router koa-bodyparser koa-json

// server/index.js 配置
// 1.配置koa-json
const json = require('koa-json')
app.use(json())

// 2.配置koa-bodyparser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// 3.配置koa-router
const user = require('./routes/user')
app.use(user.routes(), user.allowedMethods())

// 创建server/routes/user.js文件，该文件写了一些测试接口，对server/mock/user.json中的测试数据进行增删查改等操作。

```
