import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'
import Api from "../axios"

Vue.use(VueRouter)

  const routes = [
  {
    path: '/notice',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/password/forgot',
    name: 'ForgotPassword',
    component: () => import(/* webpackChunkName: "ForgotPassword" */ '../views/Password/ForgotPassword.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/password/reset',
    name: 'ResetPassword',
    component: () => import(/* webpackChunkName: "ResetPassword" */ '../views/Password/ResetPassword.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/admin/notice',
    name: 'AdminNotice',
    component: () => import('../views/Admin/Notice.vue'),
    meta: { requiresAuth: ['Admin', 'Producer', 'Staff'] }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/Admin/Users.vue'),
    meta: { requiresAuth: ['Admin', 'Producer'] }
  },
  {
    path: '/vod',
    name: 'onDemand',
    component: () => import('../views/onDemand.vue'),
  },
  {
    path: '/song-request',
    name: 'SongRequest',
    component: () => import('../views/SongRequest.vue')
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('../views/Feedback.vue')
  },
  {
    path: '/playlist',
    name: 'Playlist',
    component: () => import('../views/Playlist.vue')
  },
  {
    path: '/*',
    redirect: {name: 'Home'}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '',
  scrollBehavior: () => ({ y: 0 }),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.guestOnly)) {
    if (localStorage.getItem("Authorization")) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    }
    else next()
  }
  else {
    const { requiresAuth } = to.meta
    if (requiresAuth) {
      // not logged in so redirect to login page with the return url
      if (!localStorage.getItem("Authorization")) {
        return next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
      // check if route is restricted by role
      if (requiresAuth.length && !requiresAuth.includes(store.state.user.userRole)) {
        // role not authorised so redirect to home page
        return next({ path: '/' })
      }
    }
    next()
  }
})

Api.interceptors.response.use(null, (err) => {

  if (err.response.status === 401) {
    if (localStorage.getItem("Authorization"))
      store.dispatch('user/gotoLogin').then()
  }
  else return Promise.reject(err)
})

export default router
