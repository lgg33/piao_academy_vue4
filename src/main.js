import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css';

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import '@/icons' // icon
import '@/permission' // permission control

Vue.config.productionTip = false;

Vue.use(Element, { locale });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
