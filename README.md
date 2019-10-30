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
