/**
 * 处理任务被拒绝或者超时
 */
const setTimeOut = result => {
	// if (result.statusCode === 401 && result.header && result.header.sessionstatus === 'timeout') {
		
	// }
	// return Promise.reject(new Error('xxx---setTimeOut--xxx'));
	// console.log('===超时拦截器==>', result);
	return result;
}
export default setTimeOut;