<template>
  <div class="container">
    <h2 class="subtitle">
      Koa.js - RESTful APIs 接口测试
    </h2>
    <div>
      <input id="name" v-model="username" type="text" placeholder="请输入用户名">
      <input id="pwd" v-model="password" type="password" placeholder="请输入密码">
      <button id="submit_btn" @click="loginBtn">
        提交
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async loginBtn () {
      const res = await this.$axios.post('/api/login', {
        username: this.username,
        password: this.password
      })
      console.log(res)
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
