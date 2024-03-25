<template>
	<view>
		<view class="message-item" v-for="(message, index) in messages" :key="index"
			@click="goToMessageDetail(message)">
			<image class="message-img" :src="message.imgUrl"></image>
			<view class="message-content">
				<view class="message-title">{{ message.title }}</view>
				<view class="message-text">{{ message.text }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messages: [{
						id: 0,
						imgUrl: '../../static/client.png',
						title: '分配给我的任务',
						text: '暂无分配给我的任务'
					},
					{
						id: 1,
						imgUrl: '../../static/zhanghao@2x.png',
						title: '任务审核提醒',
						text: '暂无审核任务'
					},
					{
						id: 2,
						imgUrl: '../../static/logo.png',
						title: '任务预警提醒',
						text: '暂无临期任务'
					},
					{
						id: 3,
						imgUrl: '../../static/bg-jifen.jpg',
						title: '任务结算消息',
						text: '暂无结算任务'
					}
					// 其他消息数据...
				]
			};
		},
		methods: {
			goToMessageDetail(message) {
				// 根据传入的message进行相应的页面跳转
				// 例如：
				uni.navigateTo({
					url: '/pages/messageCenter/messageCenter?id=' + message.id
				});
			},
			onPullDownRefresh: function() {
				// 下拉刷新的时候请求一次数据
				wx.stopPullDownRefresh(); // 停止当前页面的下拉刷新状态
			}
		},
		onLoad: function() {
			console.log("answer view")
		},
		onShow: function() {
			console.log("my is show")
		}
	};
</script>

<style scoped>
	.message-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx solid #eeeeee;
	}

	.message-img {
		width: 100rpx;
		height: 100rpx;
		margin-right: 20rpx;
	}

	.message-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 10rpx;
	}

	.message-text {
		font-size: 23rpx;
		color: #666666;
	}
</style>