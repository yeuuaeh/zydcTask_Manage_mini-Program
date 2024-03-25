<template>
	<view class="login-page">
		<view class="header">
			<view class="header_text">Hi!</view>
			<view>欢迎来到智远大成</view>
		</view>

		<view class="input-wrapper">
			<view class="title">登录</view>
			<view class="input-block">
				<from-list-item :option.sync="loginFromList"></from-list-item>
			</view>
		</view>

		<view class="middle-register-btn" @click="registerClick">
			注册账号
		</view>

		<view class="middle-restpwd-btn" @click="restPassworldClick">
			忘记密码
		</view>

		<view class="bottom-text-wrapper">
			<checkbox-group @change="handleCheckboxChange">
				<checkbox value="agree" class="agree-checkbox"></checkbox>
			</checkbox-group>
			<view class="text-agree">已阅读并同意</view>
			<view class="text-policy" @click="handleItemClick('用户协议')">
				<a href="#">用户协议</a>
			</view>
			<view>和</view>
			<view class="text-policy" @click="handleItemClick('隐私政策')">
				<a href="#">隐私政策</a>
			</view>
		</view>

		<!-- 登陆 -->
		<view class="btn-wrapper">
			<button class="btn-primary btn-login" @click.stop="accountLogin">确定</button>
		</view>

		<!--微信登陆-->
		<view class="wechat-login-btn" @click="wechatLogin" style="display: none;">
			<view>
				<image class="wechat-login-btn-img" src="../../static/weixin_mw.png"></image>
			</view>
		</view>

			<view class="version">
				版本号：1.0.1
			</view>
	</view>

</template>

<script>
	//引入组件文件
	import fromListItem from '@/components/fromListItem.vue';

	export default {
		//调用组件化
		components: {
			fromListItem,
		},
		onLoad() {
			const loginData = this.$store.getters.getLoginInfo;
			if (!loginData) return;
			this.loginFromList[0][0].value = loginData.username;
			this.loginFromList[0][1].value = loginData.password;
		},
	
		data() {
			return {
				checkboxChecked: false,
				loginFromList: [
					[{
							type: 'text',
							maxlength: 16,
							aftItcon: 'zhanghao@2x.png',
							placeholder: '请输入您的账号',
							className: 'rightClass',
							value: 'user7'
						},
						{
							type: 'text',
							kind: 'password',
							maxlength: 16,
							aftItcon: 'mima@2x.png',
							placeholder: '请输入您的密码',
							value: '12345678',
							className: 'rightClass'
						}
					]
				],
				userInfo: null,
			};
		},
		methods: {
			handleItemClick(itemName) {
				// 在这里处理点击事件，根据不同的 itemName 执行对应的操作
				switch (itemName) {
					case '用户协议':
						// 处理修改密码点击事件逻辑
						uni.navigateTo({
							url: '../userProtocol/userProtocol'
						});
						break;
					case '隐私政策':
						// 处理用户协议点击事件逻辑
						uni.navigateTo({
							url: '../privacyPolicy/privacyPolicy'
						});
						break;
				}
			},
			async accountLogin() {
				if (!this.checkboxChecked) {
					this.$showToast("请同意用户协议和隐私政策")

					return;
				}
				var data = {
					"username": this.loginFromList[0][0].value,
					"password": this.loginFromList[0][1].value,
					"phone": "18670475178"
				};

				if (!data.username.trim()) {
					this.$showToast(this.loginFromList[0][0].placeholder)

					//return
				}
				if (!data.password.trim()) {
					this.$showToast(this.loginFromList[0][1].placeholder)

					// return
				}
				uni.showLoading({
					title: '登录中'
				});

			    	this.LoginAjax(data)
			},
			async LoginAjax(data) {

				const res = await this.$myRequest({
					url: 'user/signIn',
					method: "POST",
					data: JSON.stringify(data),
				})

				if (res.data.code == 0) {
					//username
					console.log("aaaaa==", res.data.data)
					console.log("aaaaa==", res)
					uni.setStorageSync('TASK_MANAGER_USERNAME', res.data.data['username'])
					uni.setStorageSync('TASK_MANAGER_ID', res.data.data['id'])
					uni.setStorageSync('TASK_MANAGER_ROLE', res.data.data['role'])
					uni.setStorageSync('TASK_MANAGER_TOKEN', res.data.data['token'])
					uni.setStorageSync('TASK_MANAGER_IPHONE', res.data.data['phone'])
					uni.switchTab({
						url: '../home/home'
					})

				} else {
					this.$showToast("请输入正确的账号或密码")
					console.log("res==", res)
				}
			},
			async wechatLogin() {
				this.getUserInfo();

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
				this.getWeixinLoginAjax(code, this.userInfo.nickName)
			},
			async getWeixinLoginAjax(codes, userinfoName) {
				var data = {
					"code": codes,
					"platform": "mini",
					"userInfo": {
						"nickName": userinfoName
					}
				};
				console.log("datadatadatadatadatadata==", data)
				const res = await this.$myRequest({
					url: 'user/signInWithWeixin',
					method: "POST",
					data: JSON.stringify(data),
				})
				console.log("yyyyyy==", res)
				if (res.data.code == 0) {

					console.log("aaaaa==", res.data.data)

				} else {
					this.$showToast("请求错误!")
				}
			},
			registerClick: function() {
				console.log("Clicked register button");
				uni.navigateTo({
					url: '../register/register'
				});
			},

			restPassworldClick() {
				console.log("bb")
				//存储用户需要的信息，如账户名，ID，token，
				uni.navigateTo({
					url: '../updatePassword/updatePassword'
				});
			},
			handleCheckboxChange(event) {
				this.checkboxChecked = event.detail.value.length > 0;
			}

		}
	}
</script>

<style lang="scss">
	@import '../../style/logins.scss';
</style>