<template>
	<view>
		<view class="codeBox" @click="save">
			<!-- 二维码 -->
			<canvas id="qrcode" canvas-id="qrcode" style="width: 200px; height: 200px;"></canvas>
			<view class="saveCode">
				保存二维码
			</view>
		</view>
	</view>
</template>

<script>
	import uqrCode from '../../utils/uqrcode.js'

	export default {
		data() {
			return {
				qrcode: false,
				imgCode: '', // 后续保存到手机相册所需要用到的字段
			}
		},
		onLoad() { 
			this.generate('https://dev.ai-boy.cn/task/share?taskId=1&userId=28')
		},
		methods: {
			// 生成二维码事件
			generate(e) {
				let context = uni.createCanvasContext('qrcode', this)
				if (context) {
					uqrCode.make({
						canvasId: 'qrcode',
						componentInstance: this,
						text: e, // 想生成二维码到内容
						size: 200,
						margin: 0,
						backgroundColor: '#fff',
						foregroundColor: '#000000',
						fileType: 'jpg',
						errorCorrectLevel: uqrCode.errorCorrectLevel.H,
						success: res => {
							this.imgCode = res // base64的图片格式
							context.drawImage(res, 0, 0, size, size)
							context.draw()
						}
					})
				}
			},
			// 保存到手机
			save() {
				uni.getSetting({ // 获取用户的当前设置
					success: (res) => {
						if (res.authSetting['scope.writePhotosAlbum']) { // 验证用户是否授权可以访问相册
							this.saveImageToPhotosAlbum();
						} else {
							uni.authorize({ // 如果没有授权，向用户发起请求
								scope: 'scope.writePhotosAlbum',
								success: () => {
									this.saveImageToPhotosAlbum();
								},
								fail: () => {
									// 提示
									uni.showToast({
										title: "请打开保存相册权限，再点击保存到手机",
										icon: "none",
										duration: 3000
									});
									setTimeout(() => {
										uni.openSetting({ // 调起客户端小程序设置界面，让用户开启访问相册
											success: (res2) => {
												// console.log(res2.authSetting)
											}
										});
									}, 3000);
								}
							})
						}
					}
				})
			},
			saveImageToPhotosAlbum() {
				let base64 = this.imgCode.replace(/^data:image\/\w+;base64,/, ""); // 去掉 data:image/png;base64,
				let filePath = `${uni.env.USER_DATA_PATH}/writeOff.png`; // 路径文件名
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				uni.getFileSystemManager().writeFile({ // 获取全局唯一的文件管理器
					filePath: filePath, // 创建一个临时文件名
					data: base64, // 写入的文本或二进制数据
					encoding: 'base64', // 写入当前文件的字符编码
					success: res => {
						uni.saveImageToPhotosAlbum({ // 保存图片到系统相册
							filePath: filePath,
							success: function(res2) {
								uni.hideLoading();
								uni.showToast({
									title: '保存成功',
									icon: "none",
									duration: 5000
								})
							},
							fail: function(err) {
								uni.hideLoading();
								// console.log(err.errMsg);
							}
						})
					},
					fail: err => {
						uni.hideLoading();
						// console.log(err)
					}
				})
			},
		}
	}
</script>