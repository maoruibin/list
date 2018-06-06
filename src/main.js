import Vue from 'vue'
import App from './app.vue'

// 注册声明组件
import Resource from 'vue-resource'
Vue.use(Resource)

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


new Vue({
	render:(h) => h(App)
}).$mount(root)
