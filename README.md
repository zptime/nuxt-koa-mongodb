# nuxt-koa-mongodb

> 在 Nuxt.js(基于 Vue.js 的服务端渲染应用框架，koa 作为服务端框架)的基础上，整合第三方模块，如@nuxtjs/axios，@nuxtjs/pwa，数据库采用 mongodb，搭建一个基础的全栈框架。

## 前期准备

- 安装 MongoDB：[https://www.mongodb.com/download-center/community](https://www.mongodb.com/download-center/community)
- 安装 MongoDB Compass(可视化工具)：[https://www.mongodb.com/download-center/compass?jmp=docs](https://www.mongodb.com/download-center/compass?jmp=docs)
- 安装 Nodejs：[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

```bash
# 我的版本
MongoDB - v4.2.1
MongoDB Compass - v1.19.12(Stable)
Nodejs - v12.13.0(includes npm v6.12.0)
```

## 创建项目

```bash
# 通过脚手架工具 create-nuxt-app 创建项目
$ npx create-nuxt-app nuxt-koa-mongodb

# 创建项目时的选择
服务器端框架 - koa
UI框架 - none
测试框架 - none
Nuxt模式 (Universal or SPA) - Universal(SSR)
第三方模块 - axios，pwa
代码规范和错误检查 - Eslint

# serve with hot reload at localhost:3000
$ cd <project-name>
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
