<template>
  <div style="padding: 20px; text-align: center;">
    <h2>测试登录设置</h2>
    <p>点击下面的按钮设置测试 token</p>
    <el-button type="primary" @click="setTestToken">设置测试 Token</el-button>
    <el-button type="success" @click="goToHome" style="margin-left: 10px;">进入系统</el-button>
    <div style="margin-top: 20px;">
      <p>当前 Token 状态: {{ tokenStatus }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestLogin',
  data() {
    return {
      tokenStatus: ''
    }
  },
  mounted() {
    this.checkToken()
  },
  methods: {
    setTestToken() {
      const token = 'test-token-' + Date.now()
      localStorage.setItem('token', token)
      this.$store.commit('SET_TOKEN', token)
      this.$store.commit('SET_USER', { name: 'admin', username: 'admin' })
      this.checkToken()
      this.$message.success('测试 Token 已设置')
    },
    goToHome() {
      this.$router.push('/')
    },
    checkToken() {
      const token = localStorage.getItem('token')
      this.tokenStatus = token ? '已设置' : '未设置'
    }
  }
}
</script>