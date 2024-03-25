<template>
	<view class="content">
		<!-- //头部 -->
		<view class="header_view">
			<!-- <image class="logo" src="../../static/logo.png"></image> -->
			<view class="integral_account">总积分</view>
			<text class="integral_text">{{integralNumbel}}</text>
			<view class="detail_text" @click="clickIntegralDetail">查看明细</view>

		</view>
		<view class="productList">
			<view class="productList_info">
				商品列表信息
			</view>
			<view class="productList_record" @click="clickProductRecord">
				<text>兑换记录</text>
				<image class="icon" src="/static/gengduo2x.png"></image>
			</view>
		</view>
		<view v-for="(item, index) in queryIntegralList" :key="index" class="listItem">

			<view class="itemLift">

				<view class="amountLift">
					<view class="dollarLift">¥</view>
					{{ item.money }}
				</view>
				<view class="text">{{item.title}}</view>
				<view class="dividerLift"></view> <!-- 添加竖直虚线 -->
			</view>
			<view class="itemTopLeft">
				<view class="userLimit" v-if="item.onlyNew === 1">限新用户</view>
			</view>
			<view class="itemContent">
				<view class="amount">{{item.title}}{{ item.money }}元</view>
				<view class="textContent">{{ item.subTitle }}</view>
			</view>
			<view class="itemRight">
				<view class="amountRight">{{ item.score }}积分</view>
				<button
					:class="{'textRight': true, 'exchange': integralTrue[index] === '兑换积分', 'insufficient': integralTrue[index] === '积分不足'}"
					@click="integralTrue[index] === '兑换积分' ? handleClick(index,item.id) : null">{{integralTrue[index]}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				integralNumbel: 0,
				integralTrue: [],
				queryIntegralList: [],
				userids:''
			};
		},
		onLoad() {
			_self  = this;
			uni.showLoading({
				title: '加载中...'
			});
			var userid = uni.getStorageSync('TASK_MANAGER_ID')
			_self.userids = userid
			this.getTotalScores(_self.userids)
			setTimeout(() => {
			    this.getIntegralList(_self.userids);
			}, 200); // 1000毫秒即1秒
		},
		onShow() {
			console.log("wo shi show");
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			this.getTotalScores(_self.userids)
			this.getIntegralList(_self.userids)
			uni.stopPullDownRefresh();
			//this.getnewsList();
		},
		methods: {
			clickProductRecord() {
				uni.navigateTo({
					url: '../../pages/IntegralListRecord/IntegralListRecord'
				})
			},
			clickIntegralDetail() {
				// 处理积分明细点击事件的逻辑
				uni.navigateTo({
					url: '../../pages/IntegralDetail/IntegralDetail'
				})
				// 在这里可以添加具体的处理逻辑
			},
			handleClick(index, id) {
				// 处理点击事件的逻辑，index 是当前点击的按钮的索引
				// uni.switchTab({
				//         url: '/pages/creditsExchange/creditsExchange'  // 替换成首页对应的页面路径
				//     });
				// 在这里可以添加具体的处理逻辑
				this.$showCustomModal('确认兑换', '您确定要进行兑换吗？', '确认', '取消', () => {
					console.log("ddd", index)
					console.log("id======", id)
					//请求ajax
					this.getCreditsExchange(id,_self.userids)
					// 确认按钮点击后的逻辑处理
				}, () => {
					console.log("erro!!")
					// 取消按钮点击后的逻辑处理
				});
			},
			//得到总积分
			async getTotalScores(userids) {
				let data = {
					"userId": userids
				}
				const res = await this.$myRequest({
					url: 'bill/wallet/get',
					method: "POST",
					data: JSON.stringify(data),
				})

				if (res.data.code == 0) {
					//success code..
					this.integralNumbel = res.data.data.score;
					console.log("yyyyyyyy==", res.data.data.score)
				} else {

					console.log("res==", res)
				}
			},
			//得到积分商城列表
			async getIntegralList(userids) {
				let data = {
					"userId": userids,
					"page": 1,
					"pageSize": 50,
					"status": "normal"
				}
				const res = await this.$myRequest({
					url: 'bill/coupon/query',
					method: "POST",
					data: JSON.stringify(data),
				})

				if (res.data.code == 0) {
					
					//success code..
					console.log("aaaaa==", res.data.data.array)
					this.queryIntegralList = res.data.data.array

					// 使用forEach方法遍历list数组
					this.queryIntegralList.forEach((item, index) => {
						if (parseInt(item.score) < this.integralNumbel) { // 注意将 jifen 转换为数字进行比较
							this.$set(this.integralTrue, index, "兑换积分");
						} else {
							this.$set(this.integralTrue, index, "积分不足");
						}
					});
					
					uni.hideLoading()
				} else {
					console.log("res==", res)
				}
			},
			//兑换积分
			async getCreditsExchange(couponid,userids) {
				let data = {
					"userId": userids,
					"couponId": couponid
				}
				const res = await this.$myRequest({
					url: 'bill/wallet/withdrawScore',
					method: "POST",
					data: JSON.stringify(data),
				})

				if (res.data.code == 0) {
					//success code..
					console.log("SUCCESS==", res)
					this.$showCustomModal('兑换码:', res.data.data.code, '复制', null, () => {
						uni.setStorageSync('TASK_MANAGER_INTEGRAL_REDEEMCODE', res.data.data.code)
						uni.switchTab({
							url: '/pages/creditsExchange/creditsExchange' // 替换成首页对应的页面路径
						});
					});
				} else {
					this.$showToast("提交过的兑换码还未通过")
					console.log("RES==", res.data)
				}
			}
		}
	}
</script>

<style>
	.content {
		background-color: #f4f4f4;
		/* 设置背景颜色为灰色 */
		width: 100vw;
		/* 设置宽度为整个视口宽度 */
		height: 100vh;
		/* 设置高度为整个视口高度 */
		position: fixed;
		/* 将内容固定在视口中 */
		top: 0;
		left: 0;
		overflow-y: auto;
		/* 如果内容超出视口高度，显示垂直滚动条 */
		overflow-x: hidden;
		/* 禁止水平滚动 */

		/* 如果内容超出视口高度，显示滚动条 */
	}

	.header_view {
		height: 320rpx;
		flex-direction: column;
		/* 设置 header_view 高度为 200 像素 */
		background-image: url('../../static/login_bg.png');
		/* 添加背景图片 */
		background-size: cover;
		/* 让背景图片占满整个 header_view */
		display: flex;
		/* 使用 Flex 布局 */
		align-items: center;
		/* 垂直居中 */
	}

	/* .logo { */
	/* //width: 100rpx; */
	/* 设置 logo 图片宽度为 80 像素 */
	/* //height: 100rpx; */
	/* 设置 logo 图片高度为 80 像素 */
	/* 	//padding: 60rpx; */
	/* 设置 logo 图片与文本的间距 */
	/* //margin-top: 60rpx; */

	//}

	.itemTopLeft {
		position: absolute;
	}

	.userLimit {
		font-size: 12px;
		/* 根据需要调整字体大小 */
		color: black;
		height: 35rpx;
		/* 根据需要调整高度 */
		margin-top: -85rpx;
		background-color: #FFD700;
		padding: 5rpx;
	}

	.integral_account {
		margin-top: 28rpx;
		color: #fff;

	}

	.integral_text {
		font-size: 65rpx;
		/* 设置文字大小为 28 像素 */
		width: 80%;
		font-weight: bold;
		margin-top: 10rpx;
		color: #fff;
		text-align: center;
	}

	.detail_text {
		margin-top: 39rpx;
		/* 设置积分明细文本与“我的积分”之间的间距 */
		text-align: center;
		color: #fff;
		/* text-decoration: underline; */
		/* 添加下划线效果 */
		cursor: pointer;
		border: 1px solid #fff;
		/* 添加外边框 */
		border-radius: 10rpx;
		padding: 5rpx 20rpx;

	}

	.productList {
		display: flex;
		justify-content: space-between;
		padding-top: 10px;
		height: 60rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.productList_info {
		flex: 1;
		text-align: left;
		margin-left: 15rpx;
		font-size: 27rpx;
		font-weight: bold;
	}

	.productList_record {
		display: flex;
		font-size: 27rpx;
		color: #333333;
		text-align: right;
		/* position: relative; */
	}


	.icon {
		width: 40rpx;
		height: 40rpx;
		margin-left: 10rpx;
		margin-right: 10rpx;


	}

	.listItem {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		height: 170rpx;
		background-color: #fff;
		border-radius: 5px;
		width: 95%;
		margin-left: 2.5%;

	}

	.itemLift {
		display: flex;
		flex-direction: column;
		align-items: left;
		color: red;
		padding: 25rpx;
		/* 使用 padding 替代 margin */
		position: relative;
		/* 设置相对定位 */
		width: 20%;
		/* 让amountLift占25%的宽度 */
	}

	.dollarLift {
		font-weight: bold;
		font-size: 25rpx;
		margin-top: 15rpx;
		/* margin-right: 5px; */
	}

	.amountLift {
		display: flex;
		align-items: center;
		font-weight: bold;
		font-size: 50rpx;
	}

	.text {
		color: red;
		font-size: 19rpx;
		font-weight: bold;
	}

	.dividerLift {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		height: 100%;
		margin-top: 5rpx;
		width: 1px;
		border-left: 2px dashed #ccc;
		/* 设置为虚线 */
	}

	.itemContent {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 20rpx;
		/* 添加内边距 */
		width: 45%;
		/* 让itemContent占50%的宽度 */
	}

	.amount {
		font-weight: bold;
		font-size: 26rpx;
	}

	.textContent {
		font-size: 32rpx;
		color: #9c9c9c;
		margin-top: 8rpx;
	}

	.itemRight {
		display: flex;
		flex-direction: column;
		align-items: right;
		padding: 0 20rpx;
		/* 添加内边距 */
		width: 30%;
		/* 让itemRight占25%的宽度 */
		color: red;
	}

	.amountRight {
		font-weight: bold;
		font-size: 26rpx;
		margin-left: 20rpx;
	}

	.textRight {
		height: 50rpx;
		font-size: 20rpx;
		width: 100%;
		margin-top: 10rpx;
		background-color: #9c9c9c;
	}

	.exchange {
		background-color: #3b9bff;
		color: white;
	}

	.insufficient {
		background-color: #9c9c9c;
		color: white;
	}
</style>