import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' },
      },
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('@/views/Articles.vue'),
        meta: { title: '文章管理', icon: 'Document' },
      },
      {
        path: 'articles/create',
        name: 'CreateArticle',
        component: () => import('@/views/ArticleEdit.vue'),
        meta: { title: '创建文章', hidden: true },
      },
      {
        path: 'articles/edit/:id',
        name: 'EditArticle',
        component: () => import('@/views/ArticleEdit.vue'),
        meta: { title: '编辑文章', hidden: true },
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/Categories.vue'),
        meta: { title: '分类管理', icon: 'Folder' },
      },
      {
        path: 'menus',
        name: 'Menus',
        component: () => import('@/views/Menus.vue'),
        meta: { title: '菜单管理', icon: 'Menu' },
      },
      {
        path: 'themes',
        name: 'Themes',
        component: () => import('@/views/Themes.vue'),
        meta: { title: '主题管理', icon: 'Brush' },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { title: '用户管理', icon: 'User' },
      },
      {
        path: 'pages',
        name: 'Pages',
        component: () => import('@/views/Pages.vue'),
        meta: { title: '页面管理', icon: 'DocumentCopy' },
      },
      {
        path: 'pages/create',
        name: 'CreatePage',
        component: () => import('@/views/PageEdit.vue'),
        meta: { title: '创建页面', hidden: true },
      },
      {
        path: 'pages/edit/:id',
        name: 'EditPage',
        component: () => import('@/views/PageEdit.vue'),
        meta: { title: '编辑页面', hidden: true },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
        meta: { title: '系统设置', icon: 'Setting' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.public) {
    next()
    return
  }

  if (!authStore.isLoggedIn) {
    next('/login')
    return
  }

  next()
})

export default router
