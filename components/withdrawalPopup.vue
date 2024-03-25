<template>
	<div class="popupContainer" v-if="showPopup" @click="preventClose">
		<div class="popupMask"></div>
		<div class="popupContent">
			<!-- <div class="closeButton" @click="closePopup">X</div> -->
			<image class="closeButton" @click="closePopup" src="../static/cancel.png"></image>
			<div class="popupInner">
				<!-- 标题 -->
				<div class="popupTitle">提现</div>

				<!-- 内容（可以添加其他内容） -->
				<div class="popupBody">
					<div class="inputLabel">提现金额</div>
					<div class="inputGroup">
						<span class="dollarSign">￥</span>
						<input type="number" v-model="withdrawAmount" placeholder="请输入提现金额" class="inputAmount">
					</div>
				</div>
				<text class="inputAmountText">注：单次提交金额不少于10元</text>
				<!-- 提交按钮 -->
				<button @click="submitWithdrawal" class="submitBtn">提交</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "withdrawalPopup",
		props: {
			showPopup: {
				type: Boolean,
				required: true
			}
		},
		data() {
			return {
				withdrawAmount: ''
			};
		},
		methods: {
			submitWithdrawal() {
				this.$emit('submit-withdrawal', this.withdrawAmount);
			},
			closePopup() {
				this.$emit('close-popup');
			},
			preventClose(event) {
				event.stopPropagation();
			}
		}
	};
</script>

<style scoped>
	.popupContainer {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.popupMask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: -1;
		/* 将遮罩层置于最底层 */
	}

	.popupContent {
		background-color: #fff;
		border-radius: 10px;
		padding: 20px;
		position: relative;
		z-index: 1;
		/* 将弹窗内容置于遮罩层之上 */
	}

	.closeButton {
		position: absolute;
		top: 10px;
		right: 10px;
		cursor: pointer;
		font-size: 20px;
		height: 39rpx;
		width: 39rpx;
	}

	.popupInner {
		text-align: center;
	}

	.popupTitle {
		font-size: 28rpx;
		margin-bottom: 20px;
	}

	.inputAmount {
		width: 90%;
		height: 70rpx;
		padding: 10px;
		margin-bottom: 20px;
		border: none;
		font-size: 50rpx;
		border-bottom: 1px solid #ccc;
		/* 只显示底部边框 */
		border-radius: 0;
	}

	.inputGroup {
		position: relative;
		
	}

	.dollarSign {
		position: absolute;
		left: 10px;
		top:60%;
		font-weight: bold;
		font-size: 50rpx;
		transform: translateY(-50%);
	}

	.inputLabel {
		font-size: 25rpx;
		color: #333;
		margin-bottom: 10px;
		float: left;
		
	}

	.submitBtn {
		background-color: #3b9bff;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		width: 260rpx;
		height: 90rpx;
		margin-top: 100rpx;
	}

	.inputAmountText {
		font-size: 22rpx;
		color: #696969;
		font-weight: bold;
		position: absolute;
		top: calc(56% + 10px);
		/* 位置相对于父元素底部的距离 */
		left: 10%;
		/* 调整左侧边距 */

	}
</style>