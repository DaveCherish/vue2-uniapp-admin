<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>系统登录</h2>
        <p>欢迎使用管理后台</p>
      </div>

      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
        label-position="left">
        <el-form-item prop="username">
          <el-input ref="username" v-model="loginForm.username" placeholder="用户名" name="username" type="text"
            tabindex="1" auto-complete="on" prefix-icon="el-icon-user" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码" name="password"
            tabindex="2" auto-complete="on" prefix-icon="el-icon-lock" @keyup.enter.native="handleLogin">
            <i slot="suffix" :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-hide'" @click="showPwd" />
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px"
            @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>

        <div class="tips">
          <p style="font-size: 14px; color: #666; text-align: center;">
            默认账号：admin / 123456
          </p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;
  box-sizing: border-box;
}

.login-box {
  width: 400px;
  max-width: 100%;
  padding: $spacing-lg;
  margin: 0 auto;
  overflow: hidden;
  background: #fff;
  border-radius: $border-radius-sm;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);

  .login-header {
    text-align: center;
    margin-bottom: $spacing-lg;

    h2 {
      font-size: 28px;
      color: #333;
      margin: 0 0 10px 0;
      font-weight: 600;
    }

    p {
      font-size: 14px;
      color: #999;
      margin: 0;
    }
  }

  .login-form {
    position: relative;
    width: 100%;
    max-width: 100%;
    overflow: hidden;

    .el-form-item {
      margin-bottom: 20px;
    }

    .el-input__inner {
      padding: 0 40px;
    }
  }

  .tips {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
    text-align: center;
  }
}

/* 修复 Element UI 按钮样式 */
.login-container .el-button {
  border-radius: $border-radius-sm;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-box {
    padding: $spacing-md;
  }
}

.login-form .el-form-item__content {
  display: flex;
  align-items: center;
}

.login-form .el-input {
  width: 100%;
}

.login-form .el-input__inner {
  height: 44px;
  line-height: 44px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 15px;
  background: #fff;
  color: #606266;
  transition: border-color 0.2s;
}

.login-form .el-input__inner:focus {
  border-color: #409eff;
  outline: none;
}

.login-form .el-input__inner:hover {
  border-color: #c0c4cc;
}

.login-form .el-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  transition: all 0.3s ease;
}

.login-form .el-button:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-form .el-button:active {
  transform: translateY(0);
}

/* 密码显示/隐藏图标样式 */
.el-input__suffix {
  cursor: pointer;
  color: #c0c4cc;
  transition: color 0.2s;
}

.el-input__suffix:hover {
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-box {
    width: 100%;
    padding: 30px 20px;
  }

  .login-header h2 {
    font-size: 24px;
  }

  .login-form .el-button {
    height: 40px;
    font-size: 14px;
  }
}
</style>
