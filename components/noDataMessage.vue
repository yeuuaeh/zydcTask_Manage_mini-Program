<template>
	<view class="container" v-if="visible">
		<view class="text-row">暂时没有数据</view>
		<image class="auth-image" src="../static/mescroll-empty.png"></image>
	
	</view>
</template>

<script>
	export default {
		name: 'NoDataMessage',
		props: {
			visible: {
				type: Boolean,
				default: false,
			},
		},
		methods: {
		
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

.auth-image{
	width: 200rpx;
	height: 200rpx;
}



</style>