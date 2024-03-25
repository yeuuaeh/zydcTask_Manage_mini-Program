export default {
	namespaced: true,
    state: {
		loginInfoKey: 'LOGIN-INFO-KEY',
		token: '',
		isLogin: false,
		userInfo: null
    },
    mutations: {
		setToken(state,token){
			state.token = token
		},
		setLoginInfo(state, data){
			uni.setStorageSync(state.loginInfoKey,JSON.stringify(data));
			state.isLogin = true;
		},
		clearLoginInfo(state){
			uni.removeStorageSync(state.loginInfoKey);
			state.isLogin = false;
		},
		loginOut(state){
			console.log('xxxxxxxxxxxxx');
			this.commit('user/setToken', null);
			this.commit('user/clearLoginInfo');
		}
    },
    actions: { 

    }
}