<template>
  <el-menu
    :default-active="$route.path"
    class="side-menu"
    background-color="#304156"
    text-color="#fff"
    active-text-color="#409EFF"
    router
  >
    <template v-for="item in menuTree">
      <!-- 一级菜单 - 有子菜单的情况 -->
      <el-submenu 
        v-if="item.children && item.children.length > 0" 
        :key="item.id" 
        :index="String(item.id)"
      >
        <template slot="title">
          <i :class="item.icon || 'el-icon-menu'"></i>
          <span>{{ item.name }}</span>
        </template>
        
        <!-- 二级菜单 -->
        <template v-for="child in item.children">
          <!-- 二级菜单 - 有三级子菜单的情况 -->
          <el-submenu 
            v-if="child.children && child.children.length > 0" 
            :key="child.id" 
            :index="String(child.id)"
          >
            <template slot="title">
              <i :class="child.icon || 'el-icon-folder'"></i>
              <span>{{ child.name }}</span>
            </template>
            
            <!-- 三级菜单 -->
            <el-menu-item 
              v-for="grandchild in child.children" 
              :key="grandchild.id" 
              :index="grandchild.url"
            >
              <i :class="grandchild.icon || 'el-icon-document'"></i>
              {{ grandchild.name }}
            </el-menu-item>
          </el-submenu>
          
          <!-- 二级菜单 - 没有子菜单的情况 -->
          <el-menu-item 
            v-else
            :key="child.id" 
            :index="child.url"
          >
            <i :class="child.icon || 'el-icon-document'"></i>
            {{ child.name }}
          </el-menu-item>
        </template>
      </el-submenu>
      
      <!-- 一级菜单 - 没有子菜单的情况 -->
      <el-menu-item 
        v-else 
        :key="item.id" 
        :index="item.url"
      >
        <i :class="item.icon || 'el-icon-house'"></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { getMenuList } from '@/utils/api'

export default {
  name: 'SideMenu',
  data() {
    return {
      menuList: [], // 原始菜单数据
      menuTree: [] // 树形菜单数据
    }
  },
  
  async created() {
    await this.loadMenuData()
  },
  
  methods: {
    // 加载菜单数据
    async loadMenuData() {
      try {
        const response = await getMenuList()
        if (response.result === 1) {
          this.menuList = response.data
          this.menuTree = this.buildMenuTree(this.menuList)
        } else {
          console.error('获取菜单数据失败:', response.msg)
        }
      } catch (error) {
        console.error('请求菜单数据失败:', error)
      }
    },
    
    // 构建菜单树形结构
    buildMenuTree(menuList) {
      // 过滤掉不显示的菜单项
      const validMenus = menuList.filter(menu => 
        menu.status === 1 && menu.is_show === 1
      )
      
      // 按 sort 和 id 排序
      validMenus.sort((a, b) => {
        if (a.sort !== b.sort) {
          return a.sort - b.sort
        }
        return a.id - b.id
      })
      
      // 构建树形结构
      const menuMap = new Map()
      const result = []
      
      // 创建所有节点的映射
      validMenus.forEach(menu => {
        menuMap.set(menu.id, { ...menu, children: [] })
      })
      
      // 构建父子关系
      validMenus.forEach(menu => {
        const menuNode = menuMap.get(menu.id)
        if (menu.pid === 0) {
          // 顶级菜单
          result.push(menuNode)
        } else {
          // 子菜单
          const parent = menuMap.get(menu.pid)
          if (parent) {
            parent.children.push(menuNode)
          }
        }
      })
      
      return result
    }
  }
}
</script>

<style lang="scss">
.side-menu {
  width: 200px;
  min-height: 100%;
  border-right: 1px solid #e6e6e6;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  background-color: #304156;

  // 一级菜单项样式
  .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding-left: 20px !important;
    transition: all 0.3s;

    &:hover {
      background-color: #263445 !important;
    }

    &.is-active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff !important;
    }

    i {
      margin-right: 10px;
      font-size: 16px;
    }
  }

  // 一级子菜单标题样式
  .el-submenu__title {
    height: 50px;
    line-height: 50px;
    padding-left: 20px !important;

    &:hover {
      background-color: #263445 !important;
    }

    i {
      margin-right: 10px;
      font-size: 16px;
    }
  }

  // 子菜单容器样式
  .el-submenu {
    overflow: hidden;
    
    // 一级子菜单中的菜单项（二级菜单）
    .el-menu-item {
      padding-left: 40px !important;
    }
    
    // 二级子菜单标题样式
    .el-submenu {
      .el-submenu__title {
        padding-left: 40px !important;
        background-color: rgba(255, 255, 255, 0.05);
        
        i {
          margin-right: 8px;
          font-size: 14px;
        }
      }
      
      // 三级菜单项样式
      .el-menu-item {
        padding-left: 60px !important;
        background-color: rgba(255, 255, 255, 0.03);
        
        &:hover {
          background-color: #1f2d3d !important;
        }
        
        i {
          margin-right: 8px;
          font-size: 14px;
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    width: 180px;
  }
}
</style>
