import store  from '@/store';
/**
 * 设置请求Token
 */
const setToken = options => {
	console.log('setToken===>');
	const token = store.getters.token;
	if(token){
		options.header  = Object.assign({}, options.header || {}, { 'Authorization': token });
		console.log('setToken', options);
	}
	
};
export default setToken;