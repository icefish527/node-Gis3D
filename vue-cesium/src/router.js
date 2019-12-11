import Vue from 'vue'
import Router from 'vue-router'
import mainView from './components/pages/mainPage/mainView'
import loadingView from './components/pages/loadingPage/loadingView'

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
