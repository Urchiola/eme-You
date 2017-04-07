import Vue from 'vue';
import VueRouter from 'vue-router';

import seller from 'components/seller/seller';
import goods from 'components/goods/good';
import ratings from 'components/ratings/ratings';

Vue.use(VueRouter);

// 定义了
const routes = [
  { path: '/seller', name: 'seller', component: seller },
  { path: '/ratings', name: 'ratings', component: ratings },
  { path: '/business', name: 'goods', component: goods }
];

export default new VueRouter({
  'linkActiveClass': 'active',
  routes // （缩写）相当于 routes: routes
});
