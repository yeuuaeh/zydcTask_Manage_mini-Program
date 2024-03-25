<template>
	<view>
		<view class="top-warp">
			<input type="text" class="input-search" :placeholder="searchPlaceholder" placeholder-style="color:#b2b2b2"
				maxlength="20" confirm-type="search" @confirm="search" />
		</view>
		<mescroll-body ref="mescrollRef" @down="downCallback" @up="upCallback" :up="upOption" top="106" bottom="30">
			<view class="patient-item border-1px" v-for="(item,index) in  inspectionReqList" :key="item.id" @click="toMore(item)">
				<view class="patient-warpper">
					<view class="basic-info">
						<text class="name">{{ item.patientName }}</text>
						<text class="sex">{{ item.patientSex == 1 ? '男' : (item.patientSex == 2 ? '女' : ' ') }}</text>
				  <text class="age">{{ item.patientAge && (item.patientAge + '岁') }}</text>
					</view>

					<view class="treatment-info">
						<view>
							<text class="label">诊疗卡号:</text>
							<text class="data">{{ item.healthCardNo}}</text>
						</view>
						<view>
							<text class="label">申请编号:</text>
					  <text class="data">{{ item.functionRequestId}}</text>
						</view>
						<view>
							<text class="label">申请时间:</text>
							<text class="data">{{ item.applyCheckTime }}</text>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {
		loadPatientList
	} from '@/api/patient.js';
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			const pageSize = 10;
			return {
				searchPlaceholder: '搜患者名称、诊疗卡号、申请编号',
				searchData: null,
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
					page: {
						size: pageSize // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					},
					textNoMore: '-- 没有更多数据了 --'
				},
				queryForm: {
					current: 1,
					size: pageSize,
					condition: {
						status: 0,
						functionRequestId: undefined, // 申请单号
						patientName: undefined, // 患者姓名
						healthCardNo: undefined, // 诊疗卡号
						ipSeqnoText: undefined, // 住院号
						startTime: "",
						endTime: "",
					},
				},
				inspectionReqList: []
			};
		},
		onLoad() {

		},
		created() {},
		methods: {
			search({
				detail
			}) {
				console.log('detail.value',detail.value)
				this.queryForm.condition.patientName = detail.value;
				this.downCallback();
			},
			async loadPatientList(mescroll) {
				this.queryForm.current = mescroll.num; // 页码, 默认从1开始
				const {
					rows,
					total
				} = await loadPatientList(this.queryForm).catch(err => this.mescroll.endErr());
				if (mescroll.num == 1) this.inspectionReqList = [];
				this.inspectionReqList = this.inspectionReqList.concat(rows);
				this.mescroll.endBySize(this.inspectionReqList.length, total);
			},
			/*下拉刷新回调*/
			downCallback() {
				this.$nextTick(() => {
			        this.mescroll.resetUpScroll(); // 重置列表数据   
									})
			},
			/*上拉加载的回调*/
			upCallback(mescroll) {
				this.loadPatientList(mescroll);
			},
			toMore(patientInfo){
				uni.navigateTo({
					url:'./patientBasicInfo',
				    success: function(res) {
					    // 通过eventChannel向被打开页面传送数据
					    res.eventChannel.emit('patientInfo', patientInfo)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/* 顶部 fixed定位*/
	.top-warp {
		z-index: 200;
		position: fixed;
		display: flex;
		top: var(--window-top);
		left: 0;
		width: 100%;
		height: 106rpx;
		box-sizing: border-box;
		background-color: #F5F5F5;
		padding: 0 30rpx;
		justify-items: center;
		align-items: center;

		.input-search {
			width: 100%;
			height: 66rpx;
			line-height: 66rpx;
			background-color: #FFFFFF;
			font-size: 28rpx;
			color: #333;
			padding: 0 10rpx;
			border-radius: 10rpx;
		}
	}

	.patient-item {
		padding: 34rpx 30rpx;
		@include border-bottom-1px(#e5e5e5);
		.patient-warpper {
			@include right-to-more(#999999);
			.basic-info {
				.name {
					color: 34rpx;
					font-size: 34rpx;
					font-weight: bold;
					margin-right: 20rpx;
				}

				.sex,
				.age {
					font-size: 28rpx;
					color: #666;
					margin-right: 14rpx;
				}
			}

			.treatment-info {
				&>view {
					font-size: 28rpx;
					margin-top: 30rpx;

					.label {
						vertical-align: middle;
						color: #999;
					}

					.data {
						vertical-align: middle;
						margin-left: 20rpx;
						color: #333;
					}
				}


			}
		}
	}
</style>
