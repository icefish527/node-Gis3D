import Vue from 'vue'
import Router from 'vue-router'
import mainView from './components/mainView.vue'
import loadingView from './components/loadingView.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: '',
      component: loadingView
    },
    {
      path: '/index',
      name: 'index',
      component: mainView
    },
  ]
})
