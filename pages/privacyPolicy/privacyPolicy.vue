<template>
	<view>

		<canvas :src="watermarkedImage" canvas-id="myCanvas"
			:style="'width:' + imageWidth + 'px; height:' + imageHeight + 'px;'"></canvas>
		<button @click="chooseImage">选择图片</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectedImage: '',
				watermarkedImage: '',
				imageWidth: 0,
				imageHeight: 0
			};
		},
		methods: {
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.selectedImage = res.tempFilePaths[0];
						uni.getImageInfo({
							src: this.selectedImage,
							success: (info) => {
								this.imageWidth = 300;
								this.imageHeight = 300;
								this.addWatermark(this.imageWidth, this.imageHeight);
							}
						});
					}
				});
			},
			addWatermark(imageWidth, imageHeight) {
				const ctx = uni.createCanvasContext('myCanvas', this);

				ctx.clearRect(0, 0, imageWidth, imageHeight);
				ctx.drawImage(this.selectedImage, 0, 0, imageWidth, imageHeight);

				const dateStr = new Date().toLocaleString();
				ctx.setFontSize(12);
				ctx.setFillStyle('#ffffff');
				ctx.fillText(dateStr, 10, 20);

				ctx.setFontSize(16);
				ctx.setFillStyle('#ffffff');
				ctx.fillText('Task 小程序项目', 10, 40);

				ctx.draw(false, () => {
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas',
						fileType: 'jpg',
						quality: 1,
						success: (res) => {
							this.watermarkedImage = res.tempFilePath;
							this.$showCustomModal('兑换码:', res.data.data.code, '复制', null, () => {
								
								
							});
						}
					});
				});
			}
		}
	};
</script>

<style>

</style>