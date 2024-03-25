<script>
	import { userLogin } from '@/api/login.js';
	export default {
		onLaunch: async function() {
			const loginData = this.$store.getters.getLoginInfo;
			 const { query } = options;
			        // 将参数存储到全局变量或本地存储中
			  uni.setStorageSync('scanParams', query);
			if(!loginData)return;
			const autoLogin  = await userLogin(loginData).catch(err=>{
				return false;
			});
			if(autoLogin){
				// uni.navigateTo({
				// 	url:'../patient/patientList'
				// })
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style class="scss">

	/*每个页面公共css */
	page{
		position: relative;
		width: 100%;
		height: 100%;
	}
	.btn-primary{
		background-color: #3B9BFF;
		color:#FFFFFF;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 50rpx;
	}
	.popup-btn-item{
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		border-radius: 18rpx;
		font-size: 36rpx;
	}
</style>
