import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../components/Login')
  },
  {
    path: '/home',
    component: () => import('../components/Home')
  }
]

const router = new VueRouter({
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径 ,from 从哪个路径跳转而来
  // next 一个函数 next() 放行, next('/login') 强制跳转

  if (to.path === '/login') return next();

  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login');
  next();
})

export default router
