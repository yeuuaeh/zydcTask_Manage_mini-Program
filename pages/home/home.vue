<template>
	<view class="content">
		<view class="header-home">
			<view class="left">
				<text style="padding-left: 20rpx;">全部</text>
				<!-- 这里可以添加选择城市功能 -->
			</view>
			<view class="center">
				<view class="search-icon">
					<image src="../../static/search.png"></image>
				</view>
				<input type="text" placeholder="请输入内容" />
				<text class="search-btn" @click="sousuoClick">搜索</text>
			</view>
			<view class="right" style="padding-right: 20rpx;">
				<image src="../../static/add.png" />
			</view>
		</view>
		<view class="header-home-function" v-if="isGetAuth">
			<view class="function-item" @click="goToPage(0)">
				<image src="../../static/file.png" class="icon"></image>
				<text class="text">积分</text>
			</view>
			<view class="function-item" @click="goToPage(1)">
				<image src="../../static/dt.png" class="icon"></image>
				<text class="text">钱包</text>
			</view>
		</view>
		<view class="moneySum">
			<view class="moneySum-left">
				¥<text>963</text>
				<view class="moneySum-left-text">
					<text>总推广预算金额</text>
				</view>
			</view>
			<view class="moneySum-right">
				¥<text>336</text>
				<view class="moneySum-right-text">
					<text>
						待结算金额
					</text>
				</view>
			</view>
		</view>
		<!-- 数据看板 -->
		<view class="dataBoard">
			<image src="../../static/dtMe.png" class="dataBoardImage"></image>
			<text class="dataBoardText">数据看板</text>
			<text class="dataBoardDate">截止{{cutoff_data}}</text>
		</view>

		<view class="dataBoardList">
			<view class="dataBoardList_left">
				<image src="../../static/bg-jifen.jpg"></image>
				<text class="helper-text">新手任务助手</text>
				<text class="helper-xs_MissionGuide">任务指南</text>
				<scroll-view class="list-container" scroll-x="false">
					<!-- 列表项 -->
					<view class="list-item" v-for="(item, index) in dataList" :key="index">
						{{ item }}
					</view>
				</scroll-view>
			</view>
			<view class="dataBoardList_right">
				<scroll-view class="list-container-right" scroll-x="false">
					<!-- 列表项 -->
					<view class="list-item-right" v-for="(itemTwo, index) in dataListTwo" :key="index">
						{{ itemTwo.label }}<text class="dataListTwoValue">{{ itemTwo.value }}</text>
						<image class="itemTwoRightImage" src="../../static/gengduo2x.png"></image>
					</view>
				</scroll-view>
			</view>
		</view>
		<noDataTask :visible="!isAuthenticated"></noDataTask>
	</view>
</template>

<script>
	import noDataTask from '@/components/noDataTask.vue';
	var _self;
	export default {
		components: {
			noDataTask,
		},
		data() {
			return {
				isAuthenticated: true,
				isGetAuth: false,
				ids: '',
				cutoff_data: '2020-2-10 09:00',
				dataList: [], // 数据列表
				dataListTwo: [], // 数据列表

			}
		},
		onLoad: function() {
			console.log("load")
			_self = this;
			this.getCurrentDate();
			// 初始化数据列表
			this.dataList = [
				'快速了解任务',
				'速知问卷题目',
				'积分分享说明',
			];
			this.dataListTwo = [{
					label: 'CRM任务新增',
					value: 12
				},
				{
					label: '问卷新增',
					value: 11
				},
				{
					label: '资料新增',
					value: 11
				},
				{
					label: '任务分享新增',
					value: 11
				},
				{
					label: '待完成任务',
					value: 11
				},
				{
					label: '审核中',
					value: 11
				},
				{
					label: '审核不通过',
					value: 11
				},
				// 其他数据...
			];
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			uni.stopPullDownRefresh();
		},
		onShow: function() {
			var id = uni.getStorageSync('TASK_MANAGER_ID')
			_self.ids = id;
			_self.getUserAuth();
		},
		methods: {
			sousuoClick() {
				console.log("code is suosou")
			},
			getCurrentDate() {
				const currentDate = new Date();
				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, '0');
				const day = String(currentDate.getDate()).padStart(2, '0');
				_self.cutoff_data = `${year}-${month}-${day} 09:00`;
			},
			goToPage(index) {
				switch (index) {
					case 0:
						// 跳转到问卷页面
						uni.navigateTo({
							url: '../IntegralList/IntegralList'
						});
						break;
					case 1:
						// 跳转到资料页面
						uni.navigateTo({
							url: '../wallet/wallet'
						});
						break;
				}
			},
			async getUserAuth() {
				// 在这里处理注册逻辑，可以发送注册请求到后端接口
				// 注册成功后的操作
				var data = {
					"userId": _self.ids
				};

				const res = await this.$myRequest({
					url: 'user/getAuth',
					method: "POST",
					data: JSON.stringify(data),
				})

				if (res.data.code == 0) {
					_self.isAuthenticated = true
					_self.isGetAuth = true
				} else {
					_self.isAuthenticated = false
					_self.isGetAuth = false
				}
			}
		}
	}
</script>

<style scoped>
	@import "../../style/home.css"
</style>