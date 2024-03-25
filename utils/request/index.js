import './interceptRequest';
import responsePromise from './interceptResponse';
const request = pam => {
	const requestPromise = new Promise((resolve,reject) => {
			uni.request({
				...pam,
				success: res => {
					resolve(res);
				},
				fail: err => {
					reject(err);
				}
			});
	});
	return responsePromise(requestPromise);
}
export default request;
