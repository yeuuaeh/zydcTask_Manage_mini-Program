<template>
	<view class="content">
		<view v-for="(item, index) in listArray" :key="index" class="listItem">
			<view class="nameType">积分兑换</view>
			  <view class="time">{{ formatTime(item.created_at) }}</view>
			<view class="amount">
			
				<view class="title">{{item.statusTitle}}</view>
			
				<text style="font-size: 39rpx;">-</text>{{ item.value }}
			</view>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				listArray: [],
				userids:'',
				statusTitle: {
					wait: "待审核",
					fail: "审核失败",
					normal: "",
				}
			};
		},
		onLoad() {
			_self = this;
			var userid = uni.getStorageSync('TASK_MANAGER_ID')
			_self.userids = userid
			console.log("wo is name")
			uni.showLoading({
				title: '加载中...'
			});
			//得到列表的请求
			_self.getIntegralListRecordAjax(_self.userids)
		},
		onShow() {
			console.log("she is name")
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			_self.getIntegralListRecordAjax(_self.userids)
		},
		methods: {
			formatTime(created_at) {
			  const date = new Date(created_at);
			  const year = date.getFullYear();
			  const month = this.addLeadingZero(date.getMonth() + 1); // 补0
			  const day = this.addLeadingZero(date.getDate()); // 补0
			  const hours = this.addLeadingZero(date.getHours()); // 补0
			  const minutes = this.addLeadingZero(date.getMinutes()); // 补0
			  const seconds = this.addLeadingZero(date.getSeconds()); // 补0
			  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			addLeadingZero(value) {
			  return value < 10 ? '0' + value : value;
			},
			//兑换积分
			async getIntegralListRecordAjax(userids) {
				let data = {
					"userId": userids,
					"page": 1,
					"pageSize": 50,
					"query": {"valueType": "score", "tradeType":"withdraw"},
					"status": ""
				}
				const res = await this.$myRequest({
					url: 'bill/query',
					method: "POST",
					data: JSON.stringify(data),
				})
			
				if (res.data.code == 0) {
					
					//success code..
					console.log("SUCCESS==", res.data.data.array)
					_self.listArray = res.data.data.array;
					res.data.data.array.forEach(item => {
					
							let statusType = item.status;
							console.log("statusType:===", statusType)
	
							item.statusTitle = _self.statusTitle[statusType] || ''; // 添加新属性保存描述
					
					
					});
					
					uni.hideLoading()
				} else {
				uni.hideLoading()
					console.log("RES==", res.data)
				}
			}
		}
	};
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		/* background-color: #e8e8e8; */
		padding-top: 20rpx;
	}
	
	.title {
		font-weight: bold;
		color: #3b9bff;
		/* 设置标题颜色 */
		font-size: 32rpx;
	
	}
	
	.listItem {
		display: flex;
		flex-direction: column;
		/* 修改为纵向排列 */
		margin-bottom: 10px;
		padding: 2.5%;
		/* background-color: #cfcfcf; */
		width: 90%;
		height: 118rpx;
		margin-left: 2.5%;
		border-radius: 10rpx;
		border: 1px solid #ccc;
	}
	
	.nameType {
		font-weight: bold;
	
	}
	
	.time {
		margin-top: 10px;
		/* 调整时间与名称间距 */
		color: #808080;
	}
	
	.amount {
		text-align: right;
		margin-top: -100rpx;
		font-size: 50rpx;
		font-weight: bold;
		color: #FF6347;
	}
</style>