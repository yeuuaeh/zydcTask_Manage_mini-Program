<!-- <template>
  <view class="list-item">
    <view class="item-info">
      <text class="item-text">{{ item.content.template.title }}</text>
      <text class="status">{{ formatTimeStatus(item.status) }}</text>
    </view>
    <view class="item-info">
      <text class="item-text">ID: {{ item.id }}</text>
      <text class="item-text">{{ formatDate(item.created_at,item.status) }}</text>
    </view>
  </view>
</template> -->
<template>
	<view class="list-item">
		<view class="left-section">
			<view class="item-info">
				<text class="item-text">{{ item.content.template.title }}</text>
			</view>
			<view class="item-info">
				<text class="item-text">ID：{{ item.id }}</text>
			</view>
		</view>
		<view class="re-section">
			<view class="item-info">
				<text class="status">{{ formatTimeStatus(item.status) }}</text>
			</view>
			<view class="item-info">
				<text class="item-text">{{ formatDate(item.created_at) }}</text>
			</view>
		</view>
	<!-- 	 v-if="isPending" -->
		<view class="right-section">
			<image class="icon" src="../static/gengduo2x.png"></image>
		</view>
	</view>
</template>
<script>
	export default {
		props: {
			item: Object,
		},
		computed: {
			isPending() {
				return this.item.status === "working";
			}
		},
		methods: {
			formatTimeStatus(status) {
				var datea = ""
				if (status === "working") {
					datea = "待完成"
				} else if (status === "wait") {
					datea = "等待审核"
				} else if (status === "fail") {
					datea = "审核拒绝"
				} else if (status === "normal") {
					datea = "审核通过"
				}
				return datea;
			},
			formatDate(timeString) {
				if (!timeString) {
					return "";
				}

				// 在这里编写日期格式化的逻辑，例如：
				const date = new Date(timeString);
				const year = date.getFullYear();
				const month = date.getMonth() + 1;
				const day = date.getDate();
				return `${year}-${month}-${day}`;



			},
		},
	};
</script>

<style scoped>
	.list-item {
		margin-bottom: 10px;
		padding: 20rpx;
		width: 95%;
		margin: 2.5%;
		border-bottom: 1px solid #ccc;
		display: flex;
	}

	.left-section {
		width: 39%;
		display: flex;
		flex-direction: column;
		/* 让内容上下排列 */
		justify-content: flex-start;
		/* 让内容靠上显示 */
	}

	.re-section {
		width: 58%;
		display: flex;
		flex-direction: column;
		/* 让内容上下排列 */
		align-items: flex-end;
		/* 让内容右对齐显示 */
	}

	.item-text-state {
		font-size: 39rpx;
		background-color: aqua;
	}

	.right-section {
		margin-left: 2%;
		/* background-color: aquamarine; */
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.item-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.icon {
		width: 50rpx;
		height: 50rpx;
	}

	.status {
		background-color: #6eb04b;
		/* 设置状态背景色 */
		color: white;
		border-radius: 5%;
		/* 创建圆形样式 */
		padding: 5rpx 10rpx;
		/* 调整内边距 */
	}
</style>