import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Register from '@/components/Register'
// import Book from '@/components/Book'
import Admin from '@/components/Admin'
import Test from '@/components/Test'
import EditUser from '@/components/EditUser'

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
      path: '/admin/',
      name: 'Admin',
      component: Admin,
      children: [
        { path: 'test', component: Test },
        { path: 'adduser', component: Register },
        { path: 'edituser/:id', component: EditUser },
      ]
    }

  ]
})
