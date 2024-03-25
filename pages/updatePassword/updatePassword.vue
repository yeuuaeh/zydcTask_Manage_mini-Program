<template>
	<view class="header-updatePassword">
		<view class="input-wrapper">
			<text class="label">原密码：</text>
			<input v-model="oldPassword" type="text" placeholder="请输入原密码" class="input-field" />
		</view>

		<view class="input-wrapper">
			<text class="label">新密码：</text>
			<input v-model="newPassword" type="text" placeholder="请输入新密码" class="input-field" />
		</view>

		<view class="input-wrapper">
			<text class="label">确认新密码：</text>
			<input v-model="confirmPassword" type="text" placeholder="请确认新密码" class="input-field" />
		</view>

		<button @click="changePassword" class="confirm-button">确认修改</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPassword: '',
				newPassword: '',
				confirmPassword: ''
			}
		},
		methods: {
			async changePassword() {
				if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
					this.$showToast("请填写完整信息")
					return;
				}

				if (this.oldPassword.length > 10 || this.newPassword.length > 10 || this.confirmPassword.length > 10) {
					this.$showToast("密码长度不能超过10个字符")
					return;
				}

				if (this.newPassword !== this.confirmPassword) {
					this.$showToast("新密码与确认密码不一致")
					return;
				}

				// 调用服务器接口函数请求修改密码
				// 假设这里有一个 changePasswordAPI 方法用来请求服务器接口
				// 调用注册请求函数
				const data = {
					username: "yyadmin",
					password: this.oldPassword,
					newPassword: this.newPassword
				};
				await this.registerAjax(data);

			},
			async registerAjax(data) {
				// 在这里处理修改密码逻辑，发送请求到后端接口
				// 修改成功后的操作
				// 假设这里有一个 $myRequest 方法用来发送网络请求
				const res = await this.$myRequest({
					url: 'user/changePassword',
					method: "POST",
					data: JSON.stringify(data),
				});

				if (res.data.code === 0) {
					// 返回上一个界面的逻辑
					uni.navigateBack({
						delta: 1 // 返回的页面数，1表示返回上一级页面，可以根据实际情况调整
					});
					this.$showToast("修改密码成功")
				} else {
					this.$showToast("修改密码失败，请重试")
				}
			}
		}
	}
</script>

<style lang="scss">
	.header-updatePassword {
		position: relative;
		height: 100%;
		width: 100%;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		margin-top: 50rpx;
		width: 90%;

	}

	.label {
		width: 100px;
		text-align: center;
		font-size: 16px;
		margin-left: 20rpx;
	}

	.input-field {
		flex: 1;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 10px 10px;
	}

	.confirm-button {
		margin-top: 80px;
		background-color: #007AFF;
		color: #fff;
		border: none;
		border-radius: 5px;
		padding: 5px 5px;
		font-size: 16px;
		text-align: center;
		width: 80%;
	}
</style>