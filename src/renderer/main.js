import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'view-design/dist/styles/iview.css'
import mixins from './mixins'

Vue.config.productionTip = false
Vue.mixin(mixins)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
