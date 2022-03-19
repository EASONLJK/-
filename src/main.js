import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import store from './store'
//编辑器
import mavonEditor from 'mavon-editor'

let axios = require('axios')
axios.defaults.baseURL = 'http://localhost:8081'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios
//为了让前端能够带上 cookie
axios.defaults.withCredentials = true
Vue.use(mavonEditor)
Vue.config.productionTip = false
Vue.use(ElementUI)
axios.defaults.headers.put['Content-Type'] = "application/json;charset=utf-8;"
router.beforeEach((to, from, next) => {
      if(store.state.user.name && to.path.startsWith('/admin')){
            initAdminMenu(router,store)
      }



      if (to.meta.requireAuth) {
        if (store.state.user) {
          axios.get('/user/authentication').then(resp => {
              if(resp) next();
          })
        } else {
          next({
            path: '/',
            query: {redirect: to.fullPath}
          })
        }
      } else {
        next()
      }
    }
)

const initAdminMenu = (router, store) => {
    if (store.state.adminMenus.length > 0) {
        return
    }
    axios.get('/admin/menu').then(resp => {
        if (resp && resp.status === 200) {
            let fmtRoutes = formatRoutes(resp.data)
            router.addRoutes(fmtRoutes)
            store.commit('initAdminMenu', fmtRoutes)
        }
    })
}


const formatRoutes = (routes) => {
    let fmtRoutes = []
    routes.forEach(route => {
        if (route.children) {
            route.children = formatRoutes(route.children)
        }

        let fmtRoute = {
            path: route.path,
            component: resolve => {
                require(['./components/admin/' + route.component + '.vue'], resolve)
            },
            name: route.name,
            name_zh: route.name_zh,
            iconCls: route.iconCls,
            meta: {
                requireAuth: true
            },
            children: route.children
        }
        fmtRoutes.push(fmtRoute)
    })
    return fmtRoutes
}




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
