import Vue from 'vue'
import App from './app.vue'

// 注册声明组件
import Resource from 'vue-resource'
Vue.use(Resource)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// Vue.http.options.emulateJSON =true
// Vue.http.interceptors.push((request, next) => {
//     request.headers.set('Access-Control-Allow-Origin', '*')
// })

// Vue.http.headers.common['Access-Control-Allow-Origin'] = '*';

import './assets/styles/global.styl'

const root = document.createElement('div')
document.body.appendChild(root)
document.title = 'TodayTodo'

new Vue({
	render:(h) => h(App)
}).$mount(root)
