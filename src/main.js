import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 全局样式
import './assets/css/global.css'

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

import axios from "axios";

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.timeout = 10000
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios;




new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
