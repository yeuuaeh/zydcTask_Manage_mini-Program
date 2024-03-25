<template>
	<view>
		<noDataTask :visible="!isAuthenticated"></noDataTask>
		我是消息中心{{id}}
	</view>
</template>

<script>
	import noDataTask from '@/components/noDataMessage.vue';
	export default {
		components: {
			noDataTask,
		},
		data() {
			return {
				id: ''
			};
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			uni.stopPullDownRefresh();
	
		},
		onLoad(option) {
			uni.showLoading({
				title: '加载中'
			});
			// 进行刷新操作
			// 通过option.id获取到传递过来的id
			const messageId = option.id;
			this.id = messageId
			// 可以根据messageId进行相应的处理，例如请求相关数据或展示对应内容
			console.log('Received message id:', messageId);
			// 模拟异步请求数据
			setTimeout(() => {
				// 隐藏加载中提示框
				uni.hideLoading();

				// 进行数据刷新操作
				// ...
			}, 1000);

		},
		methods: {

		},

	};
</script>

<style>
</style>