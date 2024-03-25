<template>
	<view>
		<view class="tab-container">
			<view class="tab-item" :class="{ active: currentTab === 0 }" @click="changeTab(0)">
				待完成
			</view>
			<view class="tab-item" :class="{ active: currentTab === 1 }" @click="changeTab(1)">
				等待审核
			</view>
			<view class="tab-item" :class="{ active: currentTab === 2 }" @click="changeTab(2)">
				审核拒绝
			</view>
			<view class="tab-item" :class="{ active: currentTab === 3 }" @click="changeTab(3)">
				审核通过
			</view>
		</view>

		<view class="tab-content">
			<view v-show="currentTab === 0">
				<tasklista v-for="(item, index) in userarray" :key="index" :item="item" @click.native="handleItemClick(item.content.template.type,item.taskId,item.toId,item.id,0)"/>
				</tasklista>
			</view>
			<view v-show="currentTab === 1">
				<tasklista v-for="(item, index) in userarray" :key="index" :item="item"  @click.native="handleItemClick(item.content.template.type,item.taskId,item.toId,item.id,1)"/>
				</tasklista>
			</view>
			<view v-show="currentTab === 2">
				<tasklista v-for="(item, index) in userarray" :key="index" :item="item" @click.native="handleItemClick(item.content.template.type,item.taskId,item.toId,item.id,2)"/>
				</tasklista>
			</view>
			<view v-show="currentTab === 3">
				<tasklista v-for="(item, index) in userarray" :key="index" :item="item" @click.native="handleItemClick(item.content.template.type,item.taskId,item.toId,item.id,3)"/>
				</tasklista>
			</view>
		</view>
	</view>
</template>

<script>
	import tasklista from '@/components/taskList.vue';
	export default {
		components: {
			tasklista
		},
		data() {
			return {
				userarray: [],
				ids: "",
				currentTab: 0,
			};
		},
		onLoad() {	
		uni.showLoading({
			title: '加载中...'
		});
		this.ids = uni.getStorageSync("TASK_MANAGER_ID");
		this.currentTab = 0;
		this.getUserAuth(this.ids,"working");
		},
		onShow() {
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			this.getUserAuth(this.ids,"working");
			uni.stopPullDownRefresh();
		},
		methods: {
			changeTab(index) {
				uni.showLoading({
					title: '加载中...'
				})
				this.currentTab = index;
				console.log(index)
				if (index == 0) {
					this.getUserAuth(this.ids, "working");
				} else if (index == 1) {
					this.getUserAuth(this.ids, "wait");
				} else if (index == 2){
					this.getUserAuth(this.ids, "fail");
				}else if (index == 3){
					this.getUserAuth(this.ids, "normal");
				}
			},

			async getUserAuth(userid,tpye) {

				var data = {
					userId: userid,
					page: 1,
					pageSize: 50,
					taskId: 0,
					query: {},
					status: tpye,
				};

				try {
					const res = await this.$myRequest({
						url: "task/queryResult",
						method: "POST",
						data: JSON.stringify(data),
					});

					if (res.data.code === 0) {
						this.userarray = res.data.data.array;
						uni.hideLoading()
						uni.stopPullDownRefresh();
					} else {
						uni.hideLoading()
						console.error("请求失败！");
						uni.stopPullDownRefresh();
					}
				} catch (error) {
					uni.hideLoading()
					console.error("请求出错: ", error);
					uni.stopPullDownRefresh();
				}
			},
			handleItemClick(type, taskid, toid, id,status) {
				// 点击事件处理程序，跳转到详情界面并传递id值
			console.log("status==",status)
				if (type != "document") {
					uni.navigateTo({
						url: `../ListParticulars/ListParticulars?type=${type}&taskid=${taskid}&toid=${toid}&id=${id}&status=${status}`
					});
				} else {
					uni.navigateTo({
						url: `../datum/datum?type=${type}&taskid=${taskid}&toid=${toid}&id=${id}&status=${status}`
						// url:'/pages/datum/datum'
					});
				}
			}
		},
	};
</script>

<style scoped>
	@import "../../style/taskList.css"
</style>