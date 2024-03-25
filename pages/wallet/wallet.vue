<template>
	<view class="content">
		<view class="walletContainer">
			<view class="walletNumbel">
				<view class="balanceTitle">钱包余额</view>
				<view class="balance">¥{{ walletNumbel }}</view>
			</view>
			<button @click="clickWithrawBtn" class="withdrawBtn">提现</button>
		</view>
		<view class="walletListView">
			<view class="incomeAndWithdraw">
				<view class="walletIncomeList">
					<text>收入列表</text>
				</view>
				<view class="withdrawRecord">
					<text @click="clickWithdrawRecord">提现记录</text>
					<image @click="clickWithdrawRecord" class="icon" src="/static/page.png"></image>
				</view>
			</view>

			<view class="listContainer" v-if="visible">
				<view v-for="(item, index) in walletListAjax" :key="index" class="listItem">
					<view class="infoContainer">
						<view class="amount">现金收入</view>
						<view class="date">日期：{{ formatTime(item.created_at) }}</view>
					</view>
					<view class="title"><text style="font-size: 29rpx;">+</text>{{item.value }}</view>
				</view>
			</view>
			<withdrawalPopup :showPopup="showWithdrawalPopup" @submit-withdrawal="handleWithdrawal"
				@close-popup="closeWithdrawalPopup" />
			<noDataTask :visible="!isAuthenticated"></noDataTask>
		</view>
	</view>
</template>

<script>
	import noDataTask from '@/components/noDataMessage.vue';
	import withdrawalPopup from '@/components/withdrawalPopup.vue';

	var _self;
	export default {
		components: {
			noDataTask,
			withdrawalPopup
		},
		data() {
			return {
				walletNumbel: 0, // 假设初始余额为 0
				walletListAjax: [],
				visible: true,
				isAuthenticated: true,
				showWithdrawalPopup: false,
				userids:''
			}
		},
		onLoad() {
			_self = this;
			uni.showLoading({
				title: '加载中...'
			});
			var userid = uni.getStorageSync('TASK_MANAGER_ID')
			_self.userids = userid
			//得到总金额钱
			_self.getTotalWalletAjax(_self.userids)
			//请求钱包的列表
			_self.getWalletListAjax(_self.userids)
		},
		onShow() {
		
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			//this.getUserAuth(_self.ids)
			//得到总金额钱
			_self.getTotalWalletAjax(_self.userids)
			//请求钱包的列表
			_self.getWalletListAjax(_self.userids)
			uni.stopPullDownRefresh(); // 停止当前页面的下拉刷新状态

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
			//得到总积分
			async getTotalWalletAjax(userid) {
				let data = {
					"userId": userid
				}
				const res = await this.$myRequest({
					url: 'bill/wallet/get',
					method: "POST",
					data: JSON.stringify(data),
				})

				if (res.data.code == 0) {
					//success code..
				
					let walletNumbel = parseInt(res.data.data.money);
					this.walletNumbel = walletNumbel;
					console.log("yyyyyyyy==", res.data.data.money)
				} else {

					console.log("res==", res)
				}
			},
			//得到钱包的列表
			async getWalletListAjax(userid) {
				let data = {
					"userId": userid,
					"page": 1,
					"pageSize": 50,
					"query": {
						"valueType": "money",
						"tradeType": "income"
					},
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
					_self.walletListAjax = res.data.data.array;
					uni.hideLoading();
				} else {
					uni.hideLoading();
					console.log("RES==", res.data)
				}
			},
			clickWithrawBtn: function() {
				console.log("wo")
				this.showWithdrawalPopup = true;
				//弹出自定义弹窗
			},
			handleWithdrawal(withdrawAmount) {
				// 在这里处理提现请求的业务逻辑
				// 可以调用后端接口等操作
				// withdrawAmount 参数为用户输入的提现金额
				if (withdrawAmount == "") {
					uni.showToast({
						title: '不能为空',
						icon: 'none'
					});
					return;
				} else if (withdrawAmount < 10) {
					uni.showToast({
						title: '至少不能少于10元',
						icon: 'none'
					});
					return;
				} else if (withdrawAmount > this.walletNumbel) {
					uni.showToast({
						title: '金额超出了',
						icon: 'none'
					});
					return;
				} else {
					//请求ajax的逻辑代码

					_self.clickWalletWithdraw(withdrawAmount,_self.userids)
					// 处理完成后，可以关闭弹窗
					this.showWithdrawalPopup = false;
				}
			},
			//提现人民币的接口Ajax
			async clickWalletWithdraw(withdrawAmount,userids) {
				withdrawAmount = parseInt(withdrawAmount);
				console.log("aaa==", typeof(withdrawAmount))
				let data = {
					"userId": userids,
					"money": withdrawAmount
				}
				const res = await this.$myRequest({
					url: 'bill/wallet/withdrawMoney',
					method: "POST",
					data: JSON.stringify(data),
				})

				if (res.data.code == 0) {
					//success code..
					console.log("SUCCESS==", res.data)
					this.$showToast("提现成功")
				} else {
					this.$showToast("已有提现订单还未通过")
					console.log("RES==", res.data)
				}
			},
			closeWithdrawalPopup() {
				this.showWithdrawalPopup = false;
			},
			clickWithdrawRecord: function() {
				uni.navigateTo({
					url: "/pages/withdrawalRecord/withdrawalRecord"
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		/* 	align-items: center;
		justify-content: center; */
		height: 100%;
		width: 100%;
		background-color: #ccc;
	}


	.balanceTitle {
		color: #DCDCDC;
	}

	.balance {
		font-size: 39px;
		color: #fff;
		font-weight: bold;
	}

	.walletContainer {
		display: flex;
		background-color: #3b9bff;
		padding-left: 60rpx;
		padding-right: 60rpx;
		padding-top: 60rpx;
		padding-bottom: 109rpx;
	}

	.walletNumbel {
		/* Adjust styles for walletNumbel if needed */
	}

	.withdrawBtn {
		background-color: #FFA500;
		color: white;
		font-weight: bold;
		font-size: 16px;
		/* 调整字体大小 */
		height: 80rpx;
		margin-top: 20rpx;
		border-radius: 5px;


	}

	.walletListView {
		background-color: #fff;
		border-radius: 50rpx 50rpx 0 0;
		margin-top: -50rpx;
		height: 100%;
	}

	.listContainer {
		margin-top: 20px;
		width: 95%;
		margin-left: 2.5%;
		background-color: #fff;

	}

	/* 	.listItem {
		padding: 10px;

		border-bottom: 1px solid #ccc;
	} */
	.listItem {
		display: flex;
		justify-content: space-between;
		padding: 10px;
		border-bottom: 1px solid #ccc;
	}

	.title {
		font-size: 20px;
		font-weight: bold;
		align-self: center;
		color: #FF6347;
	}

	/* 	.title {
		font-size: 16px;
		font-weight: bold;
	} */

	.amount {
		font-size: 16px;
		font-weight: bold;
		color: #333;
	}

	.walletIncomeList {
		margin-top: 50rpx;
		margin-left: 20rpx;
		border-bottom: 2px solid #3b9bff;
		/* 添加蓝色的下划线 */
		padding-bottom: 10px;
		/* 可选，用于调整下划线与下面内容之间的间距 */
		width: 20%;
	}

	.date {
		margin-top: 10rpx;
		font-size: 13px;
		color: #666;
	}

	.incomeAndWithdraw {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		/* 调整左右间距 */

	}

	.walletIncomeList {
		width: 25%;
		/* 收入列表占据一半宽度 */
		padding-bottom: 10px;
		/* 调整下划线与下面内容之间的间距 */
	}

	.withdrawRecord {
		width: 50%;
		/* 提现记录占据一半宽度 */
		text-align: right;
		/* 文字右对齐 */

		margin-top: 25rpx;

	}

	.icon {
		width: 20px;
		/* 设置图标宽度 */
		height: 20px;
		/* 设置图标高度 */
		margin-left: 5px;
		/* 调整图标与文本之间的间距 */
		margin-bottom: -8rpx;
		border-radius: 50rpx;
	}
</style>