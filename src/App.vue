<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default { name: 'App' }
</script>

<style lang="scss">

// 页面容器样式
.list-page {
  padding: 0;
  background-color: $bg-color-light;
  min-height: 100vh;
  box-sizing: border-box;

  // 卡片样式
  .el-card {
    border: none;
    box-shadow: $card-shadow;
    border-radius: $radius;
    overflow: hidden;
    background-color: $card-bg;

    // 卡片头部样式
    .el-card__header {
      padding: 20px 24px;
      background-color: #FFFFFF;
      border-bottom: 1px solid $border-color;

      .clearfix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
      }

      // 头部按钮样式
      .header-buttons {
        display: flex;
        gap: 12px;
      }
    }
  }
}

// 富文本编辑区域默认高度
.ck-editor__editable_inline{
  height: 400px !important;
}

// 弹出框底部按钮区域样式
.dialog-footer {
  padding: 15px 24px;
  background: none;
  border-bottom-left-radius: $radius;
  border-bottom-right-radius: $radius;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 16px;

  .el-button {
    transition: all 0.3s ease;
    border-radius: $radius;
    flex: 1;
  }

  .el-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}
</style>
