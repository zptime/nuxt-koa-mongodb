const fs = require('fs')
const path = require('path')
const router = require('koa-router')()

// -- Routes --
router.prefix('/api')

router.get('/listUsers', (ctx, next) => {
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

router.get('/addUser', (ctx, next) => {
  let data = fs.readFileSync(path.join(__dirname, '../mock/', 'user.json'), 'utf8')
  data = JSON.parse(data)
  data.user4 = user.user4
  ctx.body = {
    code: 0,
    data: JSON.stringify(data),
    msg: '添加成功'
  }
})

router.get('/user/:id', (ctx, next) => {
  let data = fs.readFileSync(path.join(__dirname, '../mock/', 'user.json'), 'utf8')
  data = JSON.parse(data)
  const user = data['user' + ctx.params.id]
  ctx.body = {
    code: 0,
    data: JSON.stringify(user),
    msg: '查询成功'
  }
})

router.get('/deleteUser/:id', (ctx, next) => {
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
