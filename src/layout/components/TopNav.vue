<template>
  <div class="top-nav">
    <div class="logo">后台管理系统</div>
    <div class="user-info">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ user.name }} <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: { ...mapState(['user']) },
  methods: {
    handleLogout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('logout')
        this.$router.push('/login')
        this.$message.success('已退出登录')
      }).catch(() => {
        // 用户取消退出
      })
    }
  }
}
</script>

<style lang="scss">
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;

  .logo {
    font-weight: bold;
    font-size: 18px;
    letter-spacing: 1px;
  }

  .user-info {
    display: flex;
    align-items: center;

    .el-dropdown-link {
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      i {
        margin-left: 8px;
        font-size: 12px;
      }
    }
  }

  /* 下拉菜单样式 */
  .el-dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: none;

    .el-dropdown-menu__item {
      padding: 10px 20px;
      color: #606266;
      transition: all 0.3s;

      &:hover {
        background-color: #f5f7fa;
        color: #409eff;
      }
    }
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    padding: 0 15px;
    height: 50px;

    .logo {
      font-size: 16px;
    }

    .user-info .el-dropdown-link {
      padding: 6px 10px;
    }
  }
}
</style>
