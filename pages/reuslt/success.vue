<template>
	<view class="success-page">
		<image class="success-img" src="../../static/success.png"></image>
		<view class="success-label">上传成功!</view>
		<button class="btn-primary res-upload" @click="resupload">继续上传</button>
		<view class="change-order">
			<button class="btn-primary btn-change" @click="toSearchOrder">更换申请单号</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			resupload(){
				const pages = getCurrentPages();
				if(pages.length==1)return
				uni.navigateBack();
			},
			toSearchOrder(){
				uni.reLaunch({
					url:'../login/login'
				});
				// const pages = getCurrentPages();
				// if(pages.length>1){
				//   uni.navigateBack({delta: 2});
				// }else{
				// 	uni.navigateBack();
				// }
			}
		}
	}
</script>

<style lang="scss">
.success-page{
	width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		text-align: center;
		font-size: 0;
		.success-img{
			margin-top: 156rpx;
			width: 353rpx;
			height: 213rpx;
		}
		.success-label{
			margin-top: 96rpx;
			font-size: 48rpx;
			font-weight: bold;
			color: #333333;
			text-align: center;
		}
		.res-upload{
			margin-top: 40rpx;
			width: 202rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 28rpx;
			color: #3B9BFF;
			box-sizing: border-box;
			border: 1rpx solid #3B9BFF;
			background-color: #FFFFFF;
		}
		.change-order{
			position: absolute;
			width: 100%;
			bottom: 160rpx;
			.btn-change{
				margin: 0 50rpx;
			}
		}
}
</style>
