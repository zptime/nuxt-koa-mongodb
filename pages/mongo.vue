<template>
  <div class="container">
    <h2 class="subtitle">
      mongodb 接口测试
    </h2>
    <div class="lists">
      <div class="list">
        <h3>获取所有用户列表(GET /mongo/users)</h3>
        <div>{{ userLists }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userLists: []
    }
  },
  async mounted () {
    const lists = await this.$axios.get('/mongo/users')
    this.userLists = lists.data
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

.lists{
  display: flex;
  flex-direction: row;
}
.lists .list{
  flex: 1;
  border:1px solid #aaa;
  margin: 10px;
}
</style>
