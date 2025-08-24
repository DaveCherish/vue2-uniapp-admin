import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: { name: '管理员' },
    token: localStorage.getItem('token') || '',
    isLogin: !!localStorage.getItem('token')
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
      state.isLogin = !!token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    }
  },
  actions: {
    // 用户登录
    login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        // 模拟登录验证
        if (username === 'admin' && password === '123456') {
          const token = 'token-' + Date.now()
          commit('SET_TOKEN', token)
          commit('SET_USER', { name: username, username: username })
          resolve()
        } else {
          reject(new Error('用户名或密码错误'))
        }
      })
    },
    // 用户登出
    logout({ commit }) {
      commit('SET_TOKEN', '')
      commit('SET_USER', {})
    }
  },
  modules: {}
})
