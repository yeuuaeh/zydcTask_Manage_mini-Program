<template>
	<view class="fail-page">
		<image class="fail-img" src="../../static/fail.png"></image>
		<view class="fail-label">上传失败!</view>
		<view class="res-upload">
			<button class="btn-primary btn-res" @click="resupload">重新上传</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods:{
			resupload(){
				const pages = getCurrentPages();
				if(pages.length==1)return
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	.fail-page {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		text-align: center;
		font-size: 0;
		.fail-img{
			margin-top: 156rpx;
			width: 353rpx;
			height: 213rpx;
		}
		.fail-label{
			margin-top: 96rpx;
			font-size: 48rpx;
			font-weight: bold;
			color: #333333;
			text-align: center;
		}
		.res-upload{
			position: absolute;
			width: 100%;
			bottom: 160rpx;
			.btn-res{
				margin: 0 50rpx;
			}
		}
	}
</style>
