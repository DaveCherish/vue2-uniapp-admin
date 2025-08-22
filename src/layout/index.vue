<template>
  <div class="layout">
    <top-nav />
    <div class="layout-body">
      <side-menu />
      <div class="layout-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue'
import SideMenu from './components/SideMenu.vue'

export default {
  components: { TopNav, SideMenu }
}
</script>

<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $bg-color;
}

.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.layout-content {
  flex: 1;
  padding: $spacing-lg;
  background: $bg-color;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: $border-radius-sm;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: $border-radius-sm;

    &:hover {
      background: #a8a8a8;
    }
  }
}

/* 全局样式重置 */
* {
  box-sizing: border-box;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-content {
    padding: $spacing-md;
  }
}
</style>
