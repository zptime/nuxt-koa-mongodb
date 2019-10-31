const router = require('koa-router')()
const User = require('../dbs/models/user.js')

// -- Routes --
router.prefix('/mongo')

// 获取用户列表
router.get('/users', async (ctx) => {
  const lists = await User.find()

  ctx.body = {
    code: 0,
    data: lists,
    msg: '获取成功'
  }
})

module.exports = router
