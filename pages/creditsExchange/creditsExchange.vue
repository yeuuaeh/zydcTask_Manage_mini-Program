<template>
	<view class="creditsExchange-page">
		<view class="header">
			<view class="overlay">
				<view class="step-container">
					<view class="step-wrapper">
						<view class="step step1">1</view>
					</view>
					<view class="connect">...</view>
					<view class="step-wrapper">
						<view class="step step2">2</view>
					</view>
					<view class="connect">...</view>
					<view class="step-wrapper">
						<view class="step step3">3</view>
					</view>
				</view>

				<view class="share-container">
					<view>答题兑换</view>
					<view>复制编码</view>
					<view>联系客服</view>
				</view>

				<view class="redeemCode">
					<view class="redeemCode_info">
						<view class="redeemCode_text">兑换码:</view>
						<view class="redeemCode_code">{{code}}</view>
					</view>
					<image class="copyButton" @click="copyCode" src="../../static/copy.png"></image>
				</view>


				<view class="share-scan-container">
					<view>客服微信号：{{codeWeixin}}</view>
					<!-- <image></image> -->
				</view>
<image class="copyButtonWX" @click="copyCodeWeiXin" src="../../static/copy.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				code: '',
				codeWeixin:'Y12345678'
			};
		},

		onLoad: function() {
			_self = this;
			console.log("客服 view")
		},
		onShow: function() {
			_self.code = uni.getStorageSync('TASK_MANAGER_INTEGRAL_REDEEMCODE')
			console.log("客服 show", _self.code)
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			uni.stopPullDownRefresh();
		},
		methods: {
			copyCode() {
			  if (this.code) { // 检查 this.code 是否为空
			    uni.setClipboardData({
			      data: this.code,
			      success: () => {  // 使用箭头函数确保 this 指向的准确性
				  this.$showToast('兑换码已复制' + this.code) 
			      }
			    });
			  } else {
			    // 提示用户兑换码为空
				this.$showToast('兑换码为空，请兑换!')
			  }
			},
			copyCodeWeiXin(){
			  if (this.codeWeixin) { // 检查 this.codeWeixin 是否为空
			    uni.setClipboardData({
			      data: this.codeWeixin,
			      success: () => {  // 使用箭头函数确保 this 指向的准确性
				  this.$showToast('微信号已复制' + this.codeWeixin)
			      }
			    });
			  } 
			},
			
		}
	};
</script>


<style lang="scss">
	.creditsExchange-page {
		height: 100%;

		.header {
			position: relative;
			height: 371rpx;
			background-image: url(../../static/bg-jifen.jpg);
			background-repeat: no-repeat;
			background-size: 100%;
			color: #FFFFFF;
			font-size: 60rpx;

			.overlay {
				display: flex;
				flex-direction: column;
				/* 垂直布局 */
				align-items: center;
				/* 垂直居中 */
				justify-content: space-around;
				/* 水平等间距排列 */
				position: absolute;
				top: 20%;
				left: 5%;
				width: 90%;
				height: 100%;
				background-color: #ffffff;
				border-radius: 20rpx;
				color: #000;

				.step-container {
					display: flex;
					justify-content: center;
					align-items: center;
					margin-top: 30rpx;
				}

				.step-wrapper {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin: 0 20px;
					/* 设置数字容器的间距 */
				}

				.step {
					width: 50px;
					height: 50px;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 60rpx;
					font-weight: bold;
					color: #FFFFFF;

				}

				.step1 {
					background-color: #00FA9A;
					/* 红色 */
				}

				.step2 {
					background-color: #4169E1;
					/* 绿色 */
				}

				.step3 {
					background-color: #FF8C00;
					/* 蓝色 */
				}

				.connect {
					font-size: 40rpx;
				}

				.share-container {
					display: flex;
					justify-content: space-between;
					width: 80%;
					font-size: 28rpx;
					font-weight: bold;
					margin-top: 3rpx;
				}

				.redeemCode {
					position: absolute;
					display: flex;
					align-items: center;
					margin-top: 400rpx;
				}

				.redeemCode_info {
					flex: 1;
					/* 占据剩余空间 */
					display: flex;
					align-items: center;
				}

				.redeemCode_text {
					margin-right: 10px;
					font-size: 30rpx;

				}

				.redeemCode_code {
					font-weight: bold;
					position: absolute;
					margin-top: 200rpx;
					border: 1px solid #ccc;
					padding: 10rpx;
					border-radius: 15rpx;
					width: 230rpx;
					height: 100rpx;
					margin-left: -39rpx;
				}

				.copyButton {

					width: 39rpx;
					height: 39rpx;

				}
				.copyButtonWX{
					position: absolute;
					width: 39rpx;
					height: 39rpx;
					padding-top: 850rpx;
				}

				.share-scan-container {
					// position: absolute;
					text-align: center;
					width: 80%;
					font-size: 28rpx;
					font-weight: bold;
					transform: translateY(950%);
					/* 向下移动 80 像素 */

					image {
						position: relative;
						/* 修改为 position: relative; */
						background-image: url(../../static/scan.png);

						background-repeat: no-repeat;
						color: #FFFFFF;
						width: 200rpx;
						height: 200rpx;
						background-size: 100%;
						top: 30rpx;
						/* 调整垂直位置 */
					}
				}
			}
		}
	}
</style>