<template>
	<view class="container" v-if="visible">
		<view class="text-row">亲，你还没有任务数据哦</view>
		<view class="text-row sub-text">申请身份认证，即可看新任务</view>
		<image class="auth-image" src="../static/fail.png"></image>
		<button class="auth-button" @click="goToAuth">立刻申请认证</button>
	</view>
</template>

<script>
	export default {
		name: 'NoDataTask',
		props: {
			visible: {
				type: Boolean,
				default: false,
			},
		},
		methods: {
			goToAuth() {
				// 这里应该跳转到身份认证界面，具体根据你的项目路由配置来
				uni.navigateTo({
					url: '/pages/authentication/authentication', // 修改为实际的身份认证页面路径
				});
			},
		},
	};
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 50%;


	}

	.text-row {
		color: black;
		margin-bottom: 10px;
	}

	.sub-text {
		color: darkgrey;
	}

	.auth-image {
		width: 100px;
		height: 100px;
		margin-bottom: 20px;
	}

	.auth-button {
		background-color: #3b9bff;
		color: white;
	}
</style>