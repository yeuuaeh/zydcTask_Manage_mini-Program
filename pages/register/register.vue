<template>
	<view class="header">
		<view class="header-account">
			<input v-model="username" type="text" placeholder="请输入账号" />
		</view>
		<view class="header-passworld">
			<input v-model="password" type="text" placeholder="请输入密码" />
		</view>
		<view class="header-iphone">
			<input v-model="iphone" type="text" placeholder="请输入手机号" />
		</view>
		<view class="affirm_account">
			<button @click="register" class="blue-button">确认注册</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				iphone: ''
			}
		},
		methods: {
			register() {


				if (!this.username.trim()) {
					this.$showToast("请输入账号")

					return;
				}
				if (!this.password.trim()) {
					this.$showToast("请输入密码")

					return;
				}
				if (!this.iphone.trim()) {
					this.$showToast("请输入手机号")

					return;
				}
				// 注册逻辑，可以在这里调用注册接口
				// 例如：调用 registerUser 方法，处理注册逻辑
				this.getUserInfo();
				//this.registerAjax(data)
			},
			//获取微信用户信息
			async getUserInfo() {

				const res = await uni.login({
					provider: 'weixin'
				});
				if (res[0]) {
					this.$showToast("登录失败，请重试")

					return;
				}
				const code = res.code;
				//用户微信信息
				const userInfo = await uni.getUserInfo({
					provider: 'weixin',
					lang: 'zh_CN'
				});
				this.userInfo = userInfo.userInfo;

				//请求接口上传code，userInfo到服务器
				console.log('code:', code);
				console.log('userInfo:', this.userInfo);
				// 在这里写上传 code 和 userInfo 的代码，调用云函数等
				this.registerAjax(code, this.userInfo)
			},
			async registerAjax(codes, userInfo) {
				// 在这里处理注册逻辑，可以发送注册请求到后端接口
				// 注册成功后的操作
				var data = {
					"username": this.username,
					"password": this.password,
					"name": "useryy",
					"gender": 1,
					"belong_of": "a1",
					"belong_id": "abc1",
					"phone": this.iphone,
					"code": codes,
					"userInfo": userInfo,
					"platform": "mini"
				};
				console.log('datadatadata:', data);
				const res = await this.$myRequest({
					url: 'user/signUp',
					method: "POST",
					data: JSON.stringify(data),
				})
				console.log('resresres:', res);
				if (res.data.code == 0) {
					// 注册成功后跳转到其他页面

					uni.navigateBack() //返回上一页
					this.$showToast("注册成功")

				} else {
					this.$showToast("此账号已注册或服务器发生错误")

				}
			}
		}
	}
</script>

<style lang="scss">
	.header {
		position: relative;
		width: 100%;
		margin-top: 90rpx;

		.header-account {
			border: solid #ccc 1px;
			border-radius: 10rpx;
			padding: 25rpx;
			margin-top: 50rpx;
			margin-left: 7%;
			width: 80%;

		}

		.header-passworld {
			border: solid #ccc 1px;
			border-radius: 10rpx;
			padding: 25rpx;
			margin-top: 20rpx;
			margin-left: 7%;
			width: 80%;
		}

		.header-iphone {
			border: solid #ccc 1px;
			border-radius: 10rpx;
			padding: 25rpx;
			margin-top: 20rpx;
			margin-left: 7%;
			width: 80%;
		}

		.affirm_account {
			width: 80%;
			height: 50rpx;
			margin-left: 10%;
			margin-top: 90rpx;
		}

		.blue-button {
			background-color: #3b9bff;
			/* 设置蓝色背景 */
			color: white;
			/* 设置文字颜色为白色 */
			border-radius: 15px;
			/* 设置圆角 */
			cursor: pointer;
			/* 设置鼠标样式为手型 */
		}
	}
</style>