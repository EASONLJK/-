import Vue from 'vue'
import VueRouter from 'vue-router'
import AppIndex from '@/components/home/AppIndex'
import Login from '@/components/Login'
import Home from "@/components/Home";
import Editor from "@/components/admin/content/ArticleEditor";
import LibraryIndex from "@/components/libaray/LibraryIndex";
Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    // home页面并不需要被访问
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'AppIndex',
        component: AppIndex,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/library',
        name: 'Library',
        component: LibraryIndex,
        meta: {
          requireAuth: true
        }
      },


    ]

  },
  {
    path: '/register',
    name: 'Resgister',
    component: () => import('../components/Register')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../components/admin/AdminIndex'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/content/editor',
    name: 'Editor',
    component: Editor,
    meta: {
      requireAuth: true
    }
  }
]



const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
