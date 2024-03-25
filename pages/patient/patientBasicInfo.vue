<template>
	<view class="basic-info-page">
		<login-mask></login-mask>
		<view class="patient-info-wrapper">
			<view class="info-row">
				<view class="info-col">
					<text class="info-label">姓名:</text>
					<text class="info-data">{{ patientInfo.patientName}}</text>
				</view>
				<view class="info-col">
					<text class="info-label">性别:</text>
					<text class="info-data">{{ patientInfo.patientSex == 1 ? '男' : (patientInfo.patientSex == 2 ? '女' : ' ') }}</text>
				</view>
			</view>
			<view class="info-row">
				<view class="info-col">
					<text class="info-label">就诊卡号:</text>
					<text class="info-data">{{ patientInfo.healthCardNo}}</text>
				</view>
				<!-- <view class="info-col">
					<text class="info-label">电话:</text>
					<text class="info-data"> </text>
				</view> -->
			</view>
			<view class="info-row">
				<view class="info-col">
					<text class="info-label">健康卡号:</text>
					<text class="info-data">{{ patientInfo.ipSeqnoText || ''}}</text>
				</view>
			</view>
			<view class="info-row">
				<view class="info-col">
					<text class="info-label">身份证号:</text>
					<text class="info-data">{{patientInfo.identityCardNo || '' }}</text>
				</view>
			</view>

		</view>
		<view class="img-list-wrapper">
			<uni-file-picker ref="files" fileMediatype="image" mode="grid" :limit="9" :imageStyles="imageStyles"
				:auto-upload="false" />
		</view>
		<view class="btn-wrapper">
			<view class="btn-cancel" @click="cancel">取消</view>
			<view class="btn-upload" @click="upload">上传</view>
		</view>
	</view>
</template>

<script>
	import loginMask from '@/components/loginMask.vue';
	import setResult from '@/utils/request/interceptResponse/setResult.js';
	export default {
		components: {
			loginMask
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title: '积分'
			});
			 this.getOpenerEventChannel().on('patientInfo', (data) => {
				this.patientInfo = data;
				this.orderNo = this.patientInfo && this.patientInfo.id;
			})
		},
		watch: {
			imageValue(val) {
				console.log('val--->', val);
			}
		},
		data() {
			return {
				patientInfo: null,
				orderNo: '',
				imageStyles: {
					border: {
						radius: '20rpx'
					}
				},
			};
		},
		methods: {
			cancel(){
				uni.navigateBack({
					data: 1
				});
			},
			upload() {
				const chooseImgList = this.$refs.files.$data.files;
				if (!chooseImgList.length) {
					uni.showToast({
						icon: 'none',
						title: '请选择您要上传的图片'
					});
					return
				};
				uni.showLoading({
					title:'准备上传'
				});
				const imgList = Array.from(chooseImgList);
				const startUpload = function(){
					this.uploadTask(imgList.shift()).then(res=>{
						if(imgList.length){
							uni.showLoading({
								title: '图片上传中'
							});
							startUpload.apply(this);
						}else{
							uni.hideLoading();
							uni.navigateTo({
								url:'../reuslt/success'
							});
							chooseImgList.splice(0);
						}
					}).catch(err=>{
						uni.hideLoading();
						uni.navigateTo({
							url:'../reuslt/fail'
						});
						chooseImgList.splice(0);
					})
				};
				startUpload.apply(this);
			},
			
			uploadTask(item) {
				if(item==null)return
				const promise = new Promise((resolve, reject) => {
					const task = uni.uploadFile({
						url: 'inspection/file/v1/upload',
						name: 'files',
						filePath: item.path,
						formData: {
							reqId: this.orderNo,
							type: 1
						},
						success: res=>{
							resolve(res);
						},
						fail: err=>{
							reject(err);
						}
					});
					//进度监听
					task.onProgressUpdate(res=>{
						item.progress = res.progress;
					});
				});
				return promise.then(setResult);
			}
		}
	}
</script>

<style lang="scss">
	.basic-info-page {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;

		.patient-info-wrapper {
			padding: 36rpx 30rpx 36rpx 30rpx;
			border-bottom: 1rpx solid #e5e5e5;

			.info-row {
				display: flex;
				color: #333333;
				font-size: 30rpx;

				&:not(:first-child) {
					margin-top: 40rpx;
				}

				.info-col {
					flex: 1;
				}
			}
		}

		.img-list-wrapper {
			padding: 31rpx;
		}

		.btn-wrapper {
			position: absolute;
			bottom: 0;
			width: 100%;
			display: flex;
			font-size: 36rpx;

			.btn-cancel {
				flex: 1;
				height: 98rpx;
				line-height: 98rpx;
				background-color: #e6e6e6;
				color: #333333;
				text-align: center;
			}

			.btn-upload {
				flex: 1;
				height: 98rpx;
				line-height: 98rpx;
				background-color: #3B9BFF;
				color: #FFFFFF;
				text-align: center;
			}
		}
	}
</style>
