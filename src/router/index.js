import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/Home'
import Details from '@/components/Details/Details'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/details',
      name: 'Details',
      component: Details
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
})
