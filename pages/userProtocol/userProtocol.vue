<head>
	<script src="/static/quill-1.3.7.min.js"></script>
	<script src="/static/image-resize-3.0.1.min.js"></script>
	<link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css">
</head>
<template>
	<view class="container">
		<view class="page-body">
			<view class='wrapper'>
				<view class='toolbar' @tap="format" style="height: 39px;overflow-y: auto;">
					<view class="iconfont icon-date" @tap="insertDate"></view>
					<view class="iconfont icon-undo" @tap="undo"></view>
					<view class="iconfont icon-redo" @tap="redo"></view>
					<view class="iconfont icon-charutupian" @tap="insertImage"></view>
					<view class="iconfont icon-shanchu" @tap="clear"></view>
				</view>

				<view class="editor-wrapper">
					<editor id="editor" class="ql-container" placeholder="开始输入..." show-img-size show-img-toolbar
						show-img-resize @statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady">
					</editor>
					<!-- <canvas :src="watermarkedImage" canvas-id="myCanvas" :style="'width:' + imageWidth + 'px; height:' + imageHeight + 'px; position: absolute; top: 0; left: 0;'"></canvas> -->
				</view>

				<!-- <editor id="editor" :style="'height: ' + editorHeight + 'px;'">
						<view>{{defaultContent}}</view>
					</editor> -->
			</view>
			<view class="">
				<button
					style="background-color:#3b9bff;height: 100rpx;bottom: 0;position: fixed;width: 100%;text-align: center;"
					type="primary" size="medium" @click="clickBtnSubmit">发布</button>
			</view>

		</view>
	</view>
	</view>
	</view>
</template>
<script>
	var _self;
	export default {
		data() {
			return {
				readOnly: false,
				formats: {},
				frontImgUrl1: '',
				content: '',
				tokens: '',
				userIds: 0,
				richTextContent: '',
				taskids: 0,
				toids: 0,
				ids: 0,
				types: '',
				imageWidth: 0,
				imageHeight: 0,
				watermarkedImage: ''
			}
		},
		onLoad(options) {
			_self = this;

			_self.types = options.type;
			_self.taskids = options.taskid;
			_self.toids = options.toid;
			_self.ids = options.id;

			console.log('接收到的 _self.types 值为:', _self.types);
			console.log('接收到的 _self.taskids 值为:', _self.taskids);
			console.log('接收到的 _self.toids 值为:', _self.toids);
			console.log('接收到的 _self.ids 值为:', _self.ids);


		},
		onShow() {
			var userId = uni.getStorageSync('TASK_MANAGER_ID')
			var token = uni.getStorageSync('TASK_MANAGER_TOKEN')
			_self.tokens = token;
			_self.userIds = userId;

			//获取服务器的资料列表
			_self.getTasktemplate(_self.userIds, _self.ids, _self.types)
		},
		methods: {
			//获取服务器的问卷列表模版
			async getTasktemplate(userIds, id, types) {
				console.log("qqq", userIds, id, types)
				let data = {
					"userId": userIds,
					"page": 1,
					"pageSize": 50,
					"taskId": 0,
					"query": {},
					"status": "working"
				}
				const res = await this.$myRequest({
					url: 'task/queryResult',
					method: "POST",
					data: JSON.stringify(data),
				})

				if (res.data.code == 0) {

					for (var i = 0; i < res.data.data.array.length; i++) {
						console.log("iii", res.data.data.array[i].id)
						if (types == res.data.data.array[i].content.template.type && id == res.data.data.array[i].id) {
							console.log("res.data.data.array[i].content", res.data.data.array[i].content)

							console.log("document==", res.data.data.array[i].content.template.content)
							_self.content = res.data.data.array[i].content;
							this.richTextContent = res.data.data.array[i].content.template.content;

						}
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: '获取问卷列表失败!',
						duration: 3000
					});
				}
			},
			//点击图片上传
			insertImage() {
				// uni.chooseImage({
				// 	count: 1,
				// 	sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				// 	sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				// 	success: (res) => {
				// 		this.editorCtx.insertImage({
				// 			src: res.tempFilePaths[0],
				// 			// alt: '图像',
				// 			success: function() {
				// 				console.log('insert image success', res.tempFilePaths[0])

				// 				_self.frontImgUrl1 = res.tempFilePaths[0];
				// 				console.log("vv", _self.frontImgUrl1)

				// 				uni.getImageInfo({
				// 					src: this.frontImgUrl1,
				// 					success: (info) => {

				// 						this.imageWidth = 300;
				// 						this.imageHeight = 300;
				// 						this.addWatermark(this.imageWidth, this.imageHeight);
				// 					}
				// 				});

				// 				//发送本地图片到服务器，获取到fileurl
				// 				// _self.getUploadImageAjax(_self.tokens, _self.userIds, _self
				// 				// 	.frontImgUrl1)
				// 			}
				// 		})
				// 	}
				// })

				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.frontImgUrl1 = res.tempFilePaths[0];
				
						uni.getImageInfo({
							src: this.frontImgUrl1,
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
				ctx.drawImage(this.frontImgUrl1, 0, 0, imageWidth, imageHeight);

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
						}
					});
				});
			},
			//发送本地图片到服务器
			async getUploadImageAjax(token, id, url) {
				console.log("aaa==", url)
				console.log("token==", token)
				console.log(" id,==", id)
				const format = url.split('.').pop();
				console.log("formatformatformat==", format)
				var data = {
					"mimeType": format,
					"userId": id
				}
				const res = await this.$myRequest({
					url: 'tasktemplate/getFileURL',
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
					console.log("formDataformDataformData", formData)
					_self.frontImgUrl1 = res.data.data.fileURL
					//获取到文件的url后，进行上传uploadfile
					this.uploadImageToServer(url, fileUrl, formData, _self.userIds);

				} else {
					uni.showToast({
						icon: 'none',
						title: '服务器错误，请检查信息再次提交!',
						duration: 3000
					});
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
						console.log("res=postwww=", res)
					}
				})
			},
			//点击提交发布的按钮
			clickBtnSubmit() {
				this.editorCtx.getContents({
					success: (res) => {
						// res 是一个包含编辑器内容的对象，可以根据需要进行处理
						const htmlContent = res.html;
						console.log("富文本 HTML 内容：", htmlContent);
						// 在这里可以对内容进行进一步处理，比如提交到服务器

						//获取到数据，进行把content提交到服务器
						_self.upLoadImageAjax(_self.taskids, _self.userIds, _self.toids, _self.content)

					}
				});
			},
			//提交最后的数据到服务器
			async upLoadImageAjax(taskids, userid, toids, content) {
				taskids = parseInt(taskids);
				toids = parseInt(toids);
				console.log("zzz==", _self.frontImgUrl1);
				console.log("conmtent==", _self.content)
				console.log("taskids", taskids)
				console.log("toids", toids)
				console.log("userid==", userid)
				var data = {
					"taskId": taskids,
					"userId": toids,
					"content": content
				};
				console.log("datadatadatadatadatadata==", data)
				const res = await this.$myRequest({
					url: 'task/submit',
					method: "POST",
					data: JSON.stringify(data),
				})
				console.log("yyyyyy==", res)
				if (res.data.code == 0) {

					console.log("success==")
					uni.navigateBack() //返回上一页
					uni.showToast({
						icon: 'none',
						title: '上传成功!',
						duration: 3000
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '请求错误!',
						duration: 3000
					});
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
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				// #ifdef MP-BAIDU
				this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor');
				// #endif

				// #ifdef APP-PLUS || MP-WEIXIN || H5
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
					this.editorCtx.setContents({
						html: this.richTextContent
					});
				}).exec()
				// #endif
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				this.editorCtx.format(name, value)
			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},

			clear() {
				uni.showModal({
					title: '清空编辑器',
					content: '确定清空编辑器全部内容？',
					success: res => {
						if (res.confirm) {
							this.editorCtx.clear({
								success: function(res) {
									console.log("clear success")
								}
							})
						}
					}
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
		}
	}
</script>
<style>
	@import "../datum/editor-icon.css";

	.page-body {
		height: calc(100vh - var(--window-top) - var(--status-bar-height));
	}

	.wrapper {
		height: 100%;
	}

	.editor-wrapper {
		height: calc(100vh - var(--window-top) - var(--status-bar-height) - 140px);
		background: #fff;
	}

	.iconfont {
		display: inline-block;
		padding: 8px 8px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 20px;
	}

	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
	}

	.ql-container {
		box-sizing: border-box;
		padding: 12px 15px;
		width: 100%;
		min-height: 30vh;
		height: 100%;
		font-size: 16px;
		line-height: 1.5;
	}

	.ql-active {
		color: #06c;
	}
</style>