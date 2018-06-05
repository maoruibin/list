import Vue from 'vue'
import App from './app.vue'

// 注册声明组件
import Resource from 'vue-resource'
Vue.use(Resource)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import './assets/styles/global.styl'
import './assets/icon/iconfont.css'

const root = document.createElement('div')
document.body.appendChild(root)


new Vue({
	render:(h) => h(App)
}).$mount(root)
