import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './mock'

// 引入ECharts相关依赖
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'

Vue.config.productionTip = false
Vue.use(ElementUI)
// 注册ECharts组件
Vue.component('v-chart', ECharts)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
