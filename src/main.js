import Vue from 'vue'
import App from './app.vue'

// 注册声明组件
import Resource from 'vue-resource'
Vue.use(Resource)

// 使用 Vue 路由组件
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 自定义主题
// 参考 http://element.eleme.io/#/zh-CN/component/custom-theme
import './assets/theme/index.css'
import ElementUI from 'element-ui';
// 默认主题地址
// import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import './assets/styles/global.styl'
import './assets/icon/iconfont.css'


const root = document.createElement('div')
document.body.appendChild(root)

// var meta = document.createElement('meta');
// meta.httpEquiv = "viewport";
// meta.content = "initial-scale=1";

var metaViewPort = document.createElement('meta');
metaViewPort.name = "viewport";
metaViewPort.content = "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no";

var metaUa = document.createElement('meta');
metaUa.httpEquiv = "X-UA-Compatible";
metaUa.content = "IE=edge,chrome=1";

var metaHandheldFriendly = document.createElement('meta');
metaHandheldFriendly.name = "HandheldFriendly";
metaHandheldFriendly.content = "true";


document.getElementsByTagName('head')[0].appendChild(metaViewPort);
document.getElementsByTagName('head')[0].appendChild(metaUa);
document.getElementsByTagName('head')[0].appendChild(metaHandheldFriendly);

import Dashboard from './todo/dashboard.vue'
import Container from './todo/container.vue'
const routes = [
  { path: '/', 					component: Container },
  { path: '/dashboard', component: Dashboard }
]
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})


new Vue({
	router,
	render:(h) => h(App)
}).$mount(root)
