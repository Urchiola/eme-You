// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from './router/index';
import vueResource from 'vue-resource';
import App from './App';

// 全局引用的样式
import 'common/stylus/index.styl';

Vue.config.productionTip = false;
// Vue.config.debug = true;
// 注冊resource
Vue.use(vueResource);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
