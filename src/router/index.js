import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from "../components/Login";
// import Home from "../components/Home";
// import Welcome from "../components/Welcome";
//
// import User from "../components/user/User";
// import Rights from "../components/power/Rights";
// import Roles from "../components/power/Roles";
//
// import Cate from "../components/goods/Cate";
// import Params from "../components/goods/Params";
//
// import GoodsList from "../components/goods/list"
// import Add from "../components/goods/Add";
//
// import Order from "../components/order/Order";
// import Report from "../components/report/Report";

// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/User.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/list.vue')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')


Vue.use(VueRouter)

const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: Users},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
      {path: '/categories', component: Cate},
      {path: '/params', component: Params},
      {path: '/goods', component: GoodsList},
      {path: '/goods/add', component: Add},
      {path: '/orders', component: Order},
      {path: '/reports', component: Report},
    ]
  }
]

const router = new VueRouter({
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径 ,from 从哪个路径跳转而来
  // next 一个函数, next() 放行, next('/login') 强制跳转

  if (to.path === '/login') return next();

  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login');
  next();
})

export default router
