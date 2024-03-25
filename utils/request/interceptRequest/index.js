import setToken from './setToken.js';
import setBaseUrl from './setBaseUrl.js';

/**
 * request拦截处理器
 */
const requestInterceptor = [setToken, setBaseUrl];


// 请求拦截器
uni.addInterceptor('request', {
	invoke(args) {
		// 注册请求拦截器
		for (const index in requestInterceptor) {
			const interceptorItem = requestInterceptor[index];
			interceptorItem.call(this,args);
		}
	}
});

// 上传文件拦截器
uni.addInterceptor('uploadFile',{
	invoke(args) {
		// 注册拦截器
		for (const index in requestInterceptor) {
			const interceptorItem = requestInterceptor[index];
			interceptorItem.call(this,args);
		}
	}
});