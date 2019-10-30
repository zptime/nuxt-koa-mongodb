const fs = require('fs')
const path = require('path')
const router = require('koa-router')()

// 路由前缀
router.prefix('/api')

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
    throw new Error('Invalid username or password')
  }

  ctx.body = {
    code: 0,
    data: {
      username,
      password
    },
    msg: '登录成功'
  }
})

// 用户退出
router.post('/logout', (ctx) => {
  ctx.body = {
    code: 0,
    data: null,
    msg: '退出成功'
  }
})

router.get('/listUsers', (ctx) => {
  const data = fs.readFileSync(path.join(__dirname, '../api/', 'user.json'), 'utf8')
  ctx.body = {
    code: 0,
    data: data.toString(),
    msg: '获取成功'
  }
})

// 添加的新用户数据
const user = {
  'user4': {
    'name': 'mohit',
    'password': 'password4',
    'profession': 'teacher',
    'id': 4
  }
}

router.get('/addUser', (ctx) => {
  let data = fs.readFileSync(path.join(__dirname, '../mock/', 'user.json'), 'utf8')
  data = JSON.parse(data)
  data.user4 = user.user4
  ctx.body = {
    code: 0,
    data: JSON.stringify(data),
    msg: '添加成功'
  }
})

router.get('/user/:id', (ctx) => {
  let data = fs.readFileSync(path.join(__dirname, '../mock/', 'user.json'), 'utf8')
  data = JSON.parse(data)
  const user = data['user' + ctx.params.id]
  ctx.body = {
    code: 0,
    data: JSON.stringify(user),
    msg: '查询成功'
  }
})

router.get('/deleteUser/:id', (ctx) => {
  let data = fs.readFileSync(path.join(__dirname, '../mock/', 'user.json'), 'utf8')
  data = JSON.parse(data)
  delete data['user' + ctx.params.id]
  ctx.body = {
    code: 0,
    data: JSON.stringify(data),
    msg: '删除成功'
  }
})

module.exports = router
