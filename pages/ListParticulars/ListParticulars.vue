<template>

	<view style="padding-bottom: 200rpx;">

		<view v-html="templateContent"></view>
		<view class="task" v-for="(question, index) in questions" :key="index">
			{{ index + 1 }}. {{ question.title }}
			<!-- //文本 -->
			<template v-if="question.type === 'text'">
				<input type="text" v-model="question.value" :disabled="isTextInputDisabled" class="task_Radio" />
				<view class="dashed-line"></view>
			</template>
			<!-- //长文本 -->
			<template v-else-if="question.type === 'comment'">
				<textarea v-model="question.value" :disabled="isTextChangDisabled" class="task_Radio"></textarea>
				<view class="dashed-line"></view>
			</template>
			<!-- //单选 -->
			<template v-else-if="question.type === 'radio'">
				<radio-group v-model="question.answerVal" @change="onRadioChange($event, question.id)"
					class="task_Radio">
					<radio v-for="(choice, choiceIndex) in question.choices" :key="choiceIndex"
						:disabled="isRadioDisabled" :value="choice.value"
						:checked="question.answerVal - 1 === choiceIndex ? 'checked' : ''">
						{{ choice.label }}
					</radio>
				</radio-group>
				<view class="dashed-line"></view>
			</template>
			<!-- //多选 -->
			<template v-else-if="question.type === 'checkbox'">
				<checkbox-group v-model="selectedValues[question.id]" @change="onCheckboxChange($event,question.id)"
					class="task_Radio">
					<checkbox :value="choice.value" v-for="(choice, index) in question.choices" :key="index"
						:disabled="isCheckboxDisabled" :checked="question.answerVal.indexOf(choice.value) > -1">
						{{ choice.label }}
					</checkbox>
				</checkbox-group>
				<view class="dashed-line"></view>
			</template>
		</view>

		<view class="fixed-button" v-if="isCheckboxButtom">
			<button @click="submitAnswersToServer" style="width: 90%;">提交</button>
			<!-- <button @click="submitWxQRcodeToServer" style="width: 45%;">分享</button> -->
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				isRadioDisabled: true,
				isCheckboxDisabled: true,
				isTextInputDisabled: true,
				isTextChangDisabled: true,
				isCheckboxButtom: true,
				questions: [],
				userIds: '',
				types: '',
				selectedValueMap: {}, //用于存储每道题的选中值
				//selectedCheckboxValuesMap: {}, // 用于存储每道多选题用户选择的值
				selectedValues: {},
				contentArray: [],
				choices: [], // 添加choices数组
				taskids: 0,
				toids: 0,
				id: 0,
				templateContent: '',
				status: '',
			};
		},
		onLoad(options) {
			_self = this;
			_self.types = options.type;
			_self.taskids = options.taskid;
			_self.toids = options.toid;
			_self.id = options.id;
			if (options.status == 0) {
				_self.status = "working";
				_self.isRadioDisabled = false
				_self.isCheckboxDisabled = false
				_self.isTextInputDisabled = false
				_self.isTextChangDisabled = false
				_self.isCheckboxButtom = true
			} else if (options.status == 1) {
				_self.status = "wait";
				_self.isRadioDisabled = true
				_self.isCheckboxDisabled = true
				_self.isTextInputDisabled = true
				_self.isTextChangDisabled = true
				_self.isCheckboxButtom = false
			} else if (options.status == 2) {
				_self.status = "fail";
				_self.isRadioDisabled = false
				_self.isCheckboxDisabled = false
				_self.isTextInputDisabled = false
				_self.isTextChangDisabled = false
				_self.isCheckboxButtom = true
			} else if (options.status == 3) {
				_self.isRadioDisabled = true
				_self.isCheckboxDisabled = true
				_self.isTextInputDisabled = true
				_self.isTextChangDisabled = true
				_self.isCheckboxButtom = false
				_self.status = "normal";
			}
			console.log('接收到的 this.selectedValueMap 值为:', this.selectedValueMap);
			console.log('接收到的 this.questions 值为:', this.questions);
			console.log('接收到的 types 值为:', _self.types);
			console.log('接收到的 taskids 值为:', _self.taskids);
			console.log('接收到的 ==toids= 值为:', _self.toids);
			console.log('接收到的 ==id= 值为:', _self.id);
			console.log('接收到的 ==status= 值为:', _self.status);
		},
		onShow: function() {
			uni.showLoading({
				title: '加载中...'
			});

			var userId = uni.getStorageSync('TASK_MANAGER_ID')
			_self.userIds = userId;
			_self.getTasktemplate(_self.userIds, _self.types, _self.id, _self.status)
		},
		methods: {
			isCheckboxChecked(value) {
				if (Array.isArray(this.answerVal)) {
					return this.answerVal.indexOf(value) !== -1;
				} else {
					return false;
				}
			},
			onRadioChange(e, questionId) {
				this.selectedValueMap[questionId] = e.target.value;
				console.log("e.target.value==", e.target.value)

			},
			onCheckboxChange(e, qunid) {
				this.selectedValues[qunid] = e.target.value;
				console.log('选中的值为:', this.selectedValues[qunid]);
				console.log('qunidqunidqunid:', e.target.value);
			},

			submitAnswersToServer() {
				let questionList = _self.contentArray.template.questions;
				for (var i = 0; i < questionList.length; i++) {
					//单选
					for (let key in this.selectedValueMap) {
						if (questionList[i].id == key) {

							questionList[i].answerVal = this.selectedValueMap[key];
							break; // 如果找到匹配的 id，则跳出循环
						}
					}
					//多选
					for (let key in this.selectedValues) {
						if (questionList[i].id == key) {

							questionList[i].answerVal = this.selectedValues[key];
							break; // 如果找到匹配的 id，则跳出循环
						}
					}
				}

				this.submitAjax(_self.contentArray, _self.taskids, _self.toids)
			},
			submitWxQRcodeToServer() {
				console.log("qr-code")
			},
			//获取服务器的问卷列表模版
			async getTasktemplate(userIds, types, id, status) {

				userIds = parseInt(userIds);
				id = parseInt(id);
				let data = {
					"userId": userIds,
					"id": id
				}
				const res = await this.$myRequest({
					url: 'task/getResult',
					method: "POST",
					data: JSON.stringify(data),
				})

				if (res.data.code == 0) {
					if (types == res.data.data.type && id == res.data.data.id) {
						console.log("res.data.data.content", res.data.data.content.template.questions)
						if (types == "question") {
							_self.contentArray = res.data.data.content;
							_self.questions = res.data.data.content.template.questions;
							_self.choices = _self.questions.find(question => question.type === 'radio')
								.choices; // 获取radio类型题目的选项
						} else if (types == "document") {
							console.log("document==", res.data.data.content.template.content)
							this.templateContent = res.data.data.content.template.content;
						} else if (types == "crm") {
							console.log("crm==", res.data.data.content.template.content)
							_self.questions = res.data.data.content.template.questions;
							_self.contentArray = res.data.data.content;
						}
					}

					uni.hideLoading();
				} else {
					this.$showToast("获取问卷列表失败!")
					uni.hideLoading();
				}
			},

			//提交的按钮
			async submitAjax(contents, taskids, toid) {

				taskids = parseInt(taskids);
				toid = parseInt(toid);

				var data = {
					"taskId": taskids,
					"userId": toid,
					"sharedUserId": 0,
					"content": contents
				};
				console.log("datadata==", data)
				const res = await this.$myRequest({
					url: 'task/submit',
					method: "POST",
					data: JSON.stringify(data),
				})
				console.log("qqqqqq==", res)
				if (res.data.code == 0) {

					uni.navigateBack() //返回上一页
					this.$showToast("上传成功!")
				} else {
					this.$showToast("请求错误!")
				}
			}
		}
	};
</script>

<style scoped>
	@import '../../style/listParticulars.css'
</style>