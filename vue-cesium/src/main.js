import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import VueBus from './vue-bus'
import echarts from "echarts"
import echartsgl from "echarts-gl"
import axios from "./util/axios"
Vue.prototype.$ajax = axios;
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition)

import './plugins/dialog'

Vue.use(VueBus);

import api from "./js/api/api";
Vue.prototype.$api = api;

import websocket from 'vue-native-websocket'
Vue.prototype.$websocket = websocket
Vue.use(websocket, 'ws://localhost:4000', {
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
})





Vue.use(ElementUI);
Vue.component('echarts', echarts)
Vue.component('echartsgl', echartsgl)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  next();
});

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});
