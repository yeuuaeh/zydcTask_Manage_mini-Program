import setTimeout from './setTimeOut.js';
import setResult from './setResult.js';

/**
 * 响应拦截器
 */
const responseInterceptor = [setTimeout, setResult];

//网络请求
const responsePromise = requestPromise => {
	let promise =  requestPromise;
	// 响应任务拦截处理
	responseInterceptor.forEach(item=>{
		promise = promise.then(item);
	});
	return promise;
};

export default responsePromise;