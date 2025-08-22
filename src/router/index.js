import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/code-generator',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'CodeGenerator',
        component: () => import('@/components/CodeGenerator.vue'),
        meta: { title: '代码生成器', icon: 'el-icon-code' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/test-login',
    component: () => import('@/views/test-login.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index.vue'),
        meta: { title: '首页', icon: 'el-icon-house' }
      }
    ]
  },
  {
    path: '/list',
    component: Layout,
    children: [
      {
        path: 'index',
        alias: 'list',
        name: 'List',
        component: () => import('@/views/list/index.vue'),
        meta: { title: '列表页', icon: 'el-icon-document' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        alias: 'form',
        name: 'Form',
        component: () => import('@/views/form/index.vue'),
        meta: { title: '表单页', icon: 'el-icon-edit' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统配置', icon: 'el-icon-setting' },
    children: [
      {
        path: 'menu/index',
        alias: 'menu',
        name: 'MenuManagement',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理' }
      },
      {
        path: 'user/index',
        alias: 'user',
        name: 'UserManagement',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '管理员列表' }
      },
      {
        path: 'permission/index',
        alias: 'permission',
        name: 'PermissionManagement',
        component: () => import('@/views/system/permission/index.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: 'config/index',
        alias: 'config',
        name: 'ConfigManagement',
        component: () => import('@/views/system/config/index.vue'),
        meta: { title: '变量配置' }
      },
      {
        path: 'config_group/index',
        alias: 'config_group',
        name: 'ConfigGroupManagement',
        component: () => import('@/views/system/config_group/index.vue'),
        meta: { title: '配置分组' }
      },
      {
        path: 'dictionary/index',
        alias: 'dictionary',
        name: 'DictionaryManagement',
        component: () => import('@/views/system/dictionary/index.vue'),
        meta: { title: '数据字典' }
      }
    ]
  }
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.path === '/login' || to.path === '/test-login') {
    if (token && to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (token) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
