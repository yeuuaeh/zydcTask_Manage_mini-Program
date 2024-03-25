<template>
	<!-- 登录遮罩 -->
	<view v-if="!logInStatus" :style="{ position: position ? position : 'fixed' }" class="loginMask-wrap"
		@tap="clickLoginMask"></view>
</template>

<script>
	export default {
		props: {
			position: {
				type: String
			}
		},
		data() {
			return {
				showView: false
			};
		},
		computed: {
			// 登录状态
			logInStatus() {
				return this.$store.getters.isLogin;
			}

		},
		watch: {
			logInStatus(newVal) {
				if (newVal) {
					uni.hideLoading();
					clearTimeout(this.$timer);
				}
			}
		},
		created() {
			// console.log(this.logInStatus);
		},
		beforeDestroy() {
			uni.hideLoading();
			clearTimeout(this.$timer);
		},
		methods: {
			clickLoginMask() {
				if (this.logInStatus) return;
				if (this.showView) return;
				this.showView = true;
				uni.hideLoading();
				uni.showLoading({
					//title:'拉取数据中...',
					complete: () => {
						clearTimeout(this.$timer);
						this.$timer = setTimeout(() => {
							uni.hideLoading();
							this.userLogin();
						}, 200);
					}
				});
			},
			userLogin() {
				var pages = getCurrentPages();
				var curPage = pages[pages.length - 1]; // 当前页面路径
				// 判断是否登录了
				if (this.logInStatus) return;
				let content = '请登录后再进行操作';
				// if (curPage.route != 'pages/usercenter/usercenter') {
				//    content = '请去移步到我的页面进行登录后再进行相关操作';
				// } 
				uni.showModal({
					title: '温馨提示',
					content: content,
					showCancel: false,
					confirmText: '确定',
					success: () => {
						this.showView = false;
						uni.navigateTo({
							url: `/pages/login/login`
						});
					}
				});

			}
		}
	};
</script>

<style lang="scss" scoped>
	.loginMask-wrap {
		top: 0;
		left: 0;
		z-index: 100000;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
</style>
