export default {
	token: state => state.user.token,
	isLogin: state => state.user.isLogin,
	getLoginInfo: state => {
		const strInfo = uni.getStorageSync(state.user.loginInfoKey);
		return (strInfo && JSON.parse(strInfo)) || null;
	}
}