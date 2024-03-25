import request from '@/utils/request';
import { getWxCode, getWxOpenId } from './wechatApi.js';
import store  from '@/store';

// openId登录
const openIdLogin = function(openid) {
	return new Promise(async (resolve,reject) => {
		const result = await request({
			url: `admin/login/v1/wx/${openid}`,
			method:'POST'
		}).catch(err=> {
			reject(err);
		});
	    console.log('openId登录:',result);
	    resolve(result);
	});
}

// 账号密码登录
const accountLogin = function(data){
	const { openId,username,password }  = data;
	return request({
		url: `admin/login/v1/wx/${openId}/password`,
		method:'POST',
		data:{
			username,
			password
		}
	});
}  


// 微信自动登录
// 登录流程:  获取wxCode --> 获取openId --> 调用openId登录接口
export function wxAutoLogin() {
	const chain = [getWxCode, getWxOpenId, openIdLogin];
	let promise = Promise.resolve();
	while(chain.length){
		promise = promise.then(chain.shift());
	}
	return promise;
}


//输入账号密码登陆并绑定微信
export function wxUserLogin(data){
	return getWxCode().then(getWxOpenId).then(res=>{
		return accountLoginBindWx(Object.assign(data,{ openId: 'xxxxxx'}));
	});
}


//账号密码登录
export function userLogin(data){
//	const result = await  request
	return new Promise((resolve, reject) => {
		request({
			url: `admin/login/v1/password`,
			method:'POST',
			data
		}).then(res=>{
			store.commit('user/setToken', res.token);
			store.commit('user/setLoginInfo', data);
			resolve(res);
		}).catch(err=>{
			console.log('err', err);
			reject(err);
		});
	})
	
}
