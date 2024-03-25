import request from '@/utils/request';

// 获取微信code
export  async function getWxCode(timeout = 3000) {
	return new Promise(async (resolve,reject) => {
		const result = await uni.login({
			provider: 'weixin',
			timeout:timeout
		}).catch(err=> reject(err));
		console.log('获取微信code:', result.code);
		resolve(result.code);
	});
	
}

// 调用后台接口获取 openId 
export function getWxOpenId(code) {
	return new Promise(async (resolve,reject) => {
		const result = await request({
			url: `/admin/login/v1/wx/openid/${code}`,
			method:'GET'
		}).catch(err=> {
			reject(err);
		});
	    console.log('获取微信openId:',result);
	    resolve(result);
	});
}


