import Vue from 'vue'
import VueRouter from 'vue-router'

const home = () => import("../views/home/home");
const login = () => import("../views/login/login");

const alerttip = () => import("../components/common/AlertTip");


const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {        
      path: '/login',             // 登录注册页面
      name: 'login',
      component: login
  },
  {
      path: '/alert-tip',
      component: alerttip
  }
]

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
