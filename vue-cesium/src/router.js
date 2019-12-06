import Vue from 'vue'
import Router from 'vue-router'
import mainView from './components/mainView.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'mainView',
      component: mainView
    }
  ]
})
