<template>
	<view class="header">
		<view class="header_view">
			<view class="image-wrapper">
				<image class="top-image-wrapper" src="../../static/logo.png"></image>
				<view class="text-container">
					<text class="name-text">{{userName}}</text>
					<text class="id-text">ID：{{iphone}}</text>
				</view>
			</view>
		</view>
		<view class="identities" v-if="visible">
			<view class="identities_wyg">
				{{role}}
				<text class="identities_wyg_text">{{role}}认证特权说明</text>
				<text class="identities_wyg_auth">{{isAuthenticated}}</text>
			</view>
		</view>

		<view class="productBank">
			<view class="productBank_view" @click="productBankClick" data-text="积分">
				<image class="productBank_text_image" src="../../static/dtMe.png"></image>
				<view class="productBank_text">积分</view>
			</view>
			<view class="productBank_view" @click="productBankClick" data-text="钱包">
				<image class="productBank_text_image" src="../../static/fileMe.png"></image>
				<view class="productBank_text">钱包</view>
			</view>
		<!-- 	<view class="productBank_view" @click="productBankClick" data-text="CRM">
				<image class="productBank_text_image" src="../../static/CRMMe.png"></image>
				<view class="productBank_text">CRM任务</view>
			</view> -->
		</view>
		<view class="header-content-wrapper">
			<view class="header-content-bg-view">
				<view class="list-item" style="padding-top: 20rpx;" @click="handleItemClick('修改密码')">
					<image class="left-image" src="../../static/updatePwd.png"></image>
					<text class="middle-text">修改密码</text>
					<image class="right-image" src="../../static/gengduo2x.png"></image>

				</view>
				<view class="divider"></view> <!-- 灰色线条 -->
				<view class="list-item" @click="handleItemClick('用户协议')">
					<image class="left-image" src="../../static/userProtocol.png"></image>
					<text class="middle-text">用户协议</text>
					<image class="right-image" src="../../static/gengduo2x.png"></image>
				</view>
				<view class="divider"></view> <!-- 灰色线条 -->
				<view class="list-item" @click="handleItemClick('隐私政策')">
					<image class="left-image" src="../../static/privacy.png"></image>
					<text class="middle-text">隐私政策</text>
					<image class="right-image" src="../../static/gengduo2x.png"></image>
				</view>
				<view class="divider"></view> <!-- 灰色线条 -->
				<view class="list-item" @click="handleItemClick('关于我们')">
					<image class="left-image" src="../../static/adbout.png"></image>
					<text class="middle-text">关于我们</text>
					<image class="right-image" src="../../static/gengduo2x.png"></image>
				</view>
				<view class="divider"></view> <!-- 灰色线条 -->
				<view class="list-item">
					<image class="left-image" src="../../static/stopUser.png"></image>
					<text class="middle-text">注销用户</text>
					<image class="right-image" src="../../static/gengduo2x.png"></image>
				</view>
				<view class="divider"></view> <!-- 灰色线条 -->
			</view>
		</view>

		<view class="bottom-wrapper">
			<button @click="exitAccount">退出账号</button>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				userName: '',
				iphone: '',
				role: -1,
				visible: false,
				isAuthenticated: '未认证'
			}
		},
		onLoad: function(e) {
			_self = this;

		},
		onShow: function() {

			var username = uni.getStorageSync('TASK_MANAGER_USERNAME')
			var id = uni.getStorageSync('TASK_MANAGER_ID')
			var iphone = uni.getStorageSync('TASK_MANAGER_IPHONE')
			var role = uni.getStorageSync('TASK_MANAGER_ROLE')

			_self.userName = username;
			_self.iphone = iphone;
			if (role == 0) {
				_self.role = "普通用户";
				this.visible = true
			} else if (role == 1) {
				_self.role = "网约工";
				this.visible = true
			} else {
				this.visible = false
			}

			//判断是否有认证
			_self.getUserAuth(id);

		},
		methods: {
			handleItemClick(itemName) {
				// 在这里处理点击事件，根据不同的 itemName 执行对应的操作
				switch (itemName) {
					case '修改密码':
						// 处理修改密码点击事件逻辑
						uni.navigateTo({
							url: '../updatePassword/updatePassword'
						});
						break;
					case '用户协议':
						// 处理用户协议点击事件逻辑
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
					case '关于我们':
						// 处理用户协议点击事件逻辑
						uni.navigateTo({
							url: '../aboutMe/aboutMe'
						});
						break;
						// 其他 list-item 的处理逻辑
				}
			},
			async getUserAuth(ids) {

				// 在这里处理注册逻辑，可以发送注册请求到后端接口
				// 注册成功后的操作
				var data = {
					"userId": ids
				};

				const res = await this.$myRequest({
					url: 'user/getAuth',
					method: "POST",
					data: JSON.stringify(data),
				})

				if (res.data.code == 0) {
					// chenggong
					_self.isAuthenticated = "已认证"
				} else {
					_self.isAuthenticated = "未认证"
				}

			},

			productBankClick(event) {
				const text = event.currentTarget.dataset.text; // 获取点击的具体内容
				console.log(text);
				switch (text) {
					case '积分':
						// 处理跳转到积分界面的逻辑
						if (_self.isAuthenticated == "已认证") {
							uni.navigateTo({
								url: '../IntegralList/IntegralList'
							});
						} else {
							uni.navigateTo({
								url: '../authentication/authentication'
							});
						}

						break;
					case '钱包':
						// 处理跳转到钱包界面的逻辑
						if (_self.isAuthenticated == "已认证") {
							uni.navigateTo({
								url: '../wallet/wallet'
							});
						} else {
							uni.navigateTo({
								url: '../authentication/authentication'
							});
						}
						break;
					// case 'CRM':
					// 	// 处理跳转到CRM任务界面的逻辑
					// 	uni.navigateTo({
					// 		url: '../crmTask/crmTask'
					// 	});
					// 	break;
					default:
						break;
				}

			},
			//退出账号
			exitAccount() {
				this.$showCustomModal('退出', '您确定要退出账号吗？', '确认', '取消', () => {
				   uni.navigateTo({
				   	url: '../login/login'
				   });
				  }, () => {
				    console.log("erro!!")
				    
				  });
			}
		}
	}
</script>

<style lang="scss">
	.header {
		position: absolute;

		width: 100%;
		background-color: #eeeeee;
		padding-bottom: 25%;

		.header_view {
			height: 300rpx;

			background-color: #ffffff;
		}

		.identities {
			height: 60rpx;
			background-color: #fff1cf;
			border-radius: 15rpx;
			padding: 20rpx;
			width: 85%;
			margin-left: 5%;
			margin-top: -68rpx;
		}

		.identities_wyg {
			color: #ab6953;
			font-weight: bold;
			font-size: 37rpx;
		}

		.identities_wyg_text {

			font-weight: bold;
			color: #666;
			font-size: 28rpx;
			margin-left: 20rpx;
		}

		.identities_wyg_auth {
			color: #ffffff;
			background-color: #d0af4c;
			width: 100rpx;
			border-radius: 10rpx;
			padding: 10rpx;
			float: right;
			font-size: 30rpx;
		}

		.productBank {
			display: flex;
			flex-wrap: wrap;
			background-color: #ffffff;
			border-radius: 20rpx;
			margin-top: 39rpx;
			width: 95%;
			margin-left: 2.5%;

		}

		.productBank_view {
			flex: 1;


			text-align: center;
			padding: 20rpx 0;
		}

		.productBank_text_image {
			width: 60rpx;
			height: 60rpx;
		}

		.image-wrapper {
			display: flex;
			align-items: center;
			padding: 90rpx 50rpx;
		}

		.top-image-wrapper {
			height: 100rpx;
			width: 100rpx;
			border-radius: 50rpx;
			margin-right: 50rpx;

		}

		.text-container {
			display: flex;
			flex-direction: column;
		}

		.name-text {
			font-size: 36rpx;
			color: #333;
			margin-bottom: 10px;
			font-weight: bold;
		}

		.id-text {
			font-size: 30rpx;
			color: #666;
		}

		.header-content-wrapper {
			width: 95%;
			margin-left: 2.5%;
			padding-top: 8rpx;
			background-color: #eeeeee;

		}

		.header-content-bg-view {

			background-color: #ffffff;
			border-radius: 20rpx;
		}

		.list-item {
			display: flex;
			align-items: center;
			margin: 28rpx;


		}

		.left-image {
			height: 40rpx;
			width: 40rpx;

		}

		.middle-text {
			flex: 1;
			margin-left: 30rpx;
		}

		.right-image {
			height: 40rpx;
			width: 40rpx;

		}

		.divider {
			height: 1px;
			background-color: #ccc;
			margin: 10rpx 10rpx;
		}

		.bottom-wrapper button {
			margin-top: 60rpx;
			width: 90%;
			background-color: #89c3eb;
			margin-left: 5%;
		}
	}
</style>