import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Register from '@/components/Register'
// import Book from '@/components/Book'
import Admin from '@/components/Admin'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register/',
      name: 'Register',
      component: Register
    },
    {
      path: '/admin/test/',
      name: 'Test',
      component: Test
    },
    {
      path: '/admin/',
      name: 'Admin',
      component: Admin
    }

  ]
})
