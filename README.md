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
    console.log('Making request to ' + config.url)
    return config
  })

  // 响应拦截器
  $axios.onResponse((resp) => {
    return Promise.resolve(resp.data)
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    // 重定向到404.vue 或者 500.vue
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

## koa-router 配置

> 文档地址：[https://github.com/ZijianHe/koa-router](https://github.com/ZijianHe/koa-router)

- [koa-json](https://github.com/koajs/json)：美观地输出 JSON response 的 Koa 中间件
- [koa-bodyparser](https://github.com/koajs/bodyparser)：Koa 没有内置 Request Body 的解析器，当需要解析请求体时，就要额外加载该中间件了，它支持 x-www-form-urlencoded, application/json 等格式的请求体，但不支持 form-data 的请求体。
- [koa-router](https://github.com/ZijianHe/koa-router)：koa 路由中间件
- 其他中间件列表：[https://github.com/koajs/koa/wiki](https://github.com/koajs/koa/wiki)
- nodemon 模块：作用是在你的服务正在运行的情况下，修改文件可以自动重启服务

```js
// 1.安装相应文件
$ npm install koa-router koa-bodyparser koa-json

// 2.server/index.js 配置
// 配置koa-json
const json = require('koa-json')
app.use(json())

// 配置koa-bodyparser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// 配置koa-router
const user = require('./routes/user')
app.use(user.routes(), user.allowedMethods())

// 3.创建server/router/user.js文件，测试接口举例：
// 用户登录
router.post('/login', (ctx) => {
  const { username, password } = ctx.request.body
  const valid = username.length && password === '123'

  if (!valid) {
    ctx.body = {
      code: -1,
      data: null,
      msg: '用户名或密码错误'
    }
  } else {
    ctx.body = {
      code: 0,
      data: {
        username,
        password
      },
      msg: '登录成功'
    }
  }
})
```

## Koa.js - RESTful APIs

> 文档地址：[https://www.tutorialspoint.com/koajs/koajs_restful_apis.htm](https://www.tutorialspoint.com/koajs/koajs_restful_apis.htm)

```js
// 文件user.js中写了一些测试接口，对user.json中的测试数据进行增删查改等操作，这些接口都符合REST接口设计规范。
// GET /api/users 获取所有用户列表
router.get("/users", ctx => {
  const data = fs.readFileSync(
    path.join(__dirname, "../mock/", "user.json"),
    "utf8"
  );
  ctx.body = {
    code: 0,
    data,
    msg: "获取成功"
  };
});

// GET /api/users/:id 获取单个用户信息
router.get("/users/:id", ctx => {
  const data = fs.readFileSync(
    path.join(__dirname, "../mock/", "user.json"),
    "utf8"
  );
  const user = JSON.parse(data).filter(item => {
    return item.id === Number(ctx.params.id);
  });
  ctx.body = {
    code: 0,
    data: user,
    msg: "查询成功"
  };
});

// POST /api/users 新增用户数据
router.post("/users", ctx => {
  let data = fs.readFileSync(
    path.join(__dirname, "../mock/", "user.json"),
    "utf8"
  );
  data = JSON.parse(data);
  data.push(ctx.request.body);
  ctx.body = {
    code: 0,
    data,
    msg: "新增成功"
  };
});

// PUT /api/users/:id 修改单个用户信息
router.put("/users/:id", ctx => {
  const data = fs.readFileSync(
    path.join(__dirname, "../mock/", "user.json"),
    "utf8"
  );
  let user = JSON.parse(data).filter(item => {
    return item.id === Number(ctx.params.id);
  });
  user = Object.assign(user[0], ctx.request.body);
  ctx.body = {
    code: 0,
    data: user,
    msg: "修改成功"
  };
});

// DELETE /api/users/:id 删除单个用户信息
router.delete("/users/:id", ctx => {
  let data = fs.readFileSync(
    path.join(__dirname, "../mock/", "user.json"),
    "utf8"
  );
  data = JSON.parse(data).filter(item => {
    return item.id !== Number(ctx.params.id);
  });
  ctx.body = {
    code: 0,
    data,
    msg: "删除成功"
  };
});

// 测试页面为restful.vue，本地可在 http://localhost:3000/restful 中查看
const lists = await this.$axios.get("/api/users");
const lists2 = await this.$axios.get("/api/users/1");
const lists3 = await this.$axios.post("/api/users", {
  id: 4,
  name: "mongodb",
  password: "password4",
  profession: "database"
});
const lists4 = await this.$axios.put("/api/users/1", {
  name: "mongodb",
  password: "password4",
  profession: "database"
});
const lists5 = await this.$axios.delete("/api/users/1");

// 实践结果如下图所示：
```

![restful api实践结果](https://github.com/zptime/resources/blob/master/images/koa-restful-api.png)

## MongoDB

> MongoDB 是一个基于分布式文件存储的数据库，由 C++ 语言编写，旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

> Mongoose：一款为异步工作环境设计的 MongoDB 对象建模工具。

> 文档地址：[https://mongoosejs.com/docs/guide.html](https://mongoosejs.com/docs/guide.html)

- 安装 mongoose。mongoose 里面有三个概念，schemal、model、entity:
  - Schema：一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
  - Model：由 Schema 发布生成的模型，具有抽象属性和行为的数据库操作
  - Entity：由 Model 创建的实体，它的操作也会影响数据库

```js
// 安装mongoose
$ npm install i mongoose

// mongodb数据库连接配置
// server/index.js
require('./dbs/config')
```

- 连接数据库(server/dbs/config.js)

```js
const mongoose = require("mongoose");
const DB_URL = "mongodb://localhost:27017/idloan"; // idloan(数据库名称)

/**
 * 连接
 */
const db = mongoose.connect(DB_URL, { useNewUrlParser: true });

/**
 * 连接成功
 */
mongoose.connection.on("connected", function() {
  console.log("Mongoose connection open to " + DB_URL);
});

/**
 * 连接异常
 */
mongoose.connection.on("error", function(err) {
  console.log("Mongoose connection error: " + err);
});

/**
 * 连接断开
 */
mongoose.connection.on("disconnected", function() {
  console.log("Mongoose connection disconnected");
});

module.exports = db;
```

- 定义和添加模型(server/dbs/models/user.js)

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 定义模型
const userSchema = new Schema({
  id: Number,
  name: String,
  password: String,
  profession: String
});

// 使用模式“编译”模型
module.exports = mongoose.model("Users", userSchema);
```

- 编写 api 接口，从数据库获取数据(server/routes/mongoUser.js)

```js
const router = require("koa-router")();
const User = require("../dbs/models/user.js");

// -- Routes --
router.prefix("/mongo");

// 获取用户列表
router.get("/users", async ctx => {
  const lists = await User.find();

  ctx.body = {
    code: 0,
    data: lists,
    msg: "获取成功"
  };
});

module.exports = router;
```

数据库图形化展示：

![数据库图形化展示](https://github.com/zptime/resources/blob/master/images/mongodb-table-user.png)
