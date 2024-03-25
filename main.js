// 当前项目采用Vue2
import App from './App';
// vue2下使用 Vue 3版本下的 API Promise 化 返回格式支持 Async/Await
import '@/utils/vue3ApiPromise';
import store from '@/store';
import { myRequest } from './api/api.js';
import myFunction from './api/function.js'
Vue.use(myFunction)

// 当前项目采用Vue2
import Vue from 'vue';
Vue.prototype.$store = store;
Vue.prototype.$myRequest = myRequest

Vue.config.productionTip = false;

App.mpType = 'app';
const app = new Vue({
	store,
	myFunction,
    ...App
});
app.$mount();


