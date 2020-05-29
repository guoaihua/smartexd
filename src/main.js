import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './eleimports'
Vue.config.productionTip = false
console.log(11);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
