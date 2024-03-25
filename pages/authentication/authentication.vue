<template>
	<view class="container">
		<view class="input-row">
			<image class="required-icon" src="../../static/mustfill.png"></image>
			<text>姓名:</text>
			<view class="header-account">
				<input type="text" placeholder="请输入姓名" />
			</view>
		</view>
		<view class="input-row">
			<image class="required-icon" src="../../static/mustfill.png"></image>
			<text>身份证:</text>
			<view class="header-account">
				<input type="text" placeholder="请输入身份证号码" />
			</view>
		</view>
		<view class="upload_authentication_text">
			<image class="required-icon" src="../../static/mustfill.png"></image>
			<text>上传身份证照片</text>
		</view>
		<!-- 正面图片上传 -->
		<!-- <view class="upload-area" @click="chooseImage('front')"> -->
		<view class="upload-area">
			<view class="upload-area-left" @click="chooseImage('front')">
				<image class="upload-img" v-if="frontImg" :src="frontImg"></image>
				<text v-else>点击上传正面照</text>
			</view>
			<view class="upload-area-right" @click="chooseImage('back')">
				<image class="upload-img" v-if="backImg" :src="backImg"></image>
				<text v-else>点击上传正面照</text>
			</view>
		</view>

		<view class="gps_content">
			<button @click="getLocation">获取位置信息</button>
			<view>经度：{{ longitudes }}</view>
			<view>纬度：{{ latitudes }}</view>
		</view>
		<!-- <view class="upload_authentication_text">
			<image class="required-icon" src="../../static/mustfill.png"></image>
			<text>获取设备经纬度</text>
		</view> -->

		<!-- 反面图片上传 -->
		<!-- <view class="upload-area" @click="chooseImage('back')">
			<image class="upload-img" v-if="backImg" :src="backImg"></image>
			<text v-else>点击上传反面照</text>
		</view> -->

		<!-- 上传按钮 -->
		<button class="btn_upload" @click="submit">上传审核</button>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				frontImg: '', // 存储正面照路径
				backImg: '', // 存储反面照路径
				frontImgUrl1: '',
				backImgUrl2: '',
				tokens: '',
				userIds: '',
				longitudes: '',
				latitudes: ''
			}
		},
		onLoad() {
			_self = this;
			uni.getLocation({
				type: 'wgs84',
				success: res => {
					_self.longitudes = res.longitude;
					_self.latitudes = res.latitude;
				},
				fail: err => {
					console.log('获取位置信息失败', err);
				}
			});
		},
		onShow: function() {
			var userId = uni.getStorageSync('TASK_MANAGER_ID')
			var token = uni.getStorageSync('TASK_MANAGER_TOKEN')
			_self.tokens = token;
			_self.userIds = userId;

		},
		methods: {
			// 选择图片
			chooseImage(side) {
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: (res) => {
						console.log("cc")
						// 返回选定照片的本地文件路径列表
						if (side === 'front') {
							_self.frontImg = res.tempFilePaths[0];
							_self.getUploadImageAjax(_self.tokens, _self.userIds, _self.frontImg, "front")
						} else if (side === 'back') {
							_self.backImg = res.tempFilePaths[0];
							_self.getUploadImageAjax(_self.tokens, _self.userIds, _self.backImg, "back")
						}
					}
				});
			},
			//获取定位经纬度
			getLocation() {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						_self.longitudes = res.longitude;
						_self.latitudes = res.latitude;
					},
					fail: err => {
						console.log('获取位置信息失败', err);
						this.$showToast("定位失败，请开启定位权限!")	
					}
				});
			},
			// 提交图片进行审核

			// getUploadImageAjax() {
			// 	console.log("a")
			// },

			async getUploadImageAjax(token, id, url, imageTitle) {

				const format = url.split('.').pop();

				var data = {
					"mimeType": format,
					"userId": id
				}
				const res = await this.$myRequest({
					url: 'user/getFileURL',
					method: "POST",
					data: JSON.stringify(data),
					token: token // 将token传递给myRequest函数
				})
				if (res.data.code == 0) {
					let url = res.data.data.url
					let fileUrl = res.data.data.fileURL
					let formData = res.data.data.formData
					console.log("resresres", res)
					console.log("fileUrlfileUrl", fileUrl)
					console.log("imageTitleimageTitleimageTitle", imageTitle)
					if (imageTitle == "front") {
						_self.frontImgUrl1 = res.data.data.fileURL
						this.uploadImageToServer(url, _self.frontImg, formData, id);
					} else {
						_self.backImgUrl2 = res.data.data.fileURL
						this.uploadImageToServer(url, _self.backImg, formData, id);
					}
					// 调用上传图片方法

					//

				} else {
					this.$showToast("服务器错误，请检查信息再次提交!")
				}
			},
			async uploadImageToServer(url, fileUrl, formData, userId) {
				//const filePath = ''; // 本地图片路径
				console.log("1url", url)
				console.log("1fileUrl", fileUrl)
				console.log("1formData", formData)
				uni.uploadFile({
					url: url,
					filePath: fileUrl,
					name: 'file',
					formData: formData,
					success: (res) => {
						console.log("res=post=", res)
					}
				})
			},
			submit() {
				// if (!this.frontImg || !this.backImg) {
				// 	uni.showToast({
				// 		title: '请上传正反面照片',
				// 		icon: 'none'
				// 	});
				// 	return;
				// }

				_self.upLoadImageAjax()
				//
				// 这里应该是上传图片的代码，具体实现依赖后端接口
				// 假设有一个函数uploadImage用于上传图片
				// uploadImage(this.frontImg);
				// uploadImage(this.backImg);
			},
			async upLoadImageAjax() {
				console.log("zzz==", _self.frontImgUrl1);
				console.log("fff==", _self.backImgUrl2)
				var data = {
					"userId": _self.userIds,
					"imgURL1": _self.frontImgUrl1,
					"imgURL2": _self.backImgUrl2,
					"longitude": _self.longitudes,
					"latitude": _self.latitudes
				}
				console.log("token==token==", _self.tokens)
				console.log("data==data==", data)
				const res = await this.$myRequest({
					url: 'user/uploadAuth',
					method: "POST",
					data: JSON.stringify(data),
					token: _self.tokens // 将token传递给myRequest函数
				})
				console.log("res.data.code==", res)
				if (res.data.code == 0) {

					console.log("success==", res)
					uni.navigateTo({
						url: '../home/home'
					});
					this.$showToast("提交身份认证成功!")
				} else {
					console.log("erro==", erro)
					this.$showToast("服务器错误，请检查信息再次提交!")
				}
				// uni.uploadFile({
				// 	url: url, // 上传文件的服务器接口
				// 	filePath: fileUrl, // 要上传文件资源的路径
				// 	name: 'file', // 文件对应的 key，开发者在服务器端通过这个 key 可以获取到文件二进制内容
				// 	formData: formData,
				// 	success: (res) => {
				// 		console.log("yuanyi==res==", res); // 上传成功后的服务器返回数据
				// 		//this.uploadAuthAjax();
				// 	}
				// });
			},
			async uploadAuthAjax() {
				console.log("nnn")
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
	}

	.required-icon {
		width: 20px;
		height: 20px;
		margin-right: 5px;
	}

	.input-row {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		width: 100%;
	}

	.header-account {
		border: solid #ccc 1px;
		border-radius: 10rpx;
		padding: 10rpx;

		width: 70%;


	}

	.upload_authentication_text {

		float: left;
		width: 100%;
		margin-bottom: 30rpx;
	}

	.upload-area {
		/* 	background-color: aqua; */
		width: 100%;
		height: 100px;
		/* 	border: 1px dashed #ccc; */
		margin-bottom: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.upload-area-left {
		border: 1px dashed #000;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 45%;
		margin-right: 5%;
		background-color: aliceblue;
	}

	.upload-area-right {
		border: 1px dashed #000;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 45%;
		background-color: aliceblue;
	}

	.upload-img {
		width: 100%;
		height: 100%;

	}

	.btn_upload {
		margin-top: 60rpx;
		width: 80%;
		background-color: #3b9bff;
		color: #ffffff;
	}
</style>