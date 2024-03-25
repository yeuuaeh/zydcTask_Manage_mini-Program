<template>
	<view>
		<view v-for="(question, index) in questions" :key="index">
			{{ index + 1 }}. {{ question.title }}
			<template v-if="question.type === 'text'">
				<input type="text" v-model="question.answerVal" />
			</template>
			<template v-else-if="question.type === 'comment'">
				<textarea v-model="question.value"></textarea>
			</template>
			<template v-else-if="question.type === 'radio'">
			    <radio-group v-model="question.answerVal">
			        <radio v-for="(choice, choiceIndex) in question.choices" :key="choiceIndex" :value="choice.value">
			            {{ choice.label }}
			        </radio>
			    </radio-group>
			</template>
			<template v-else-if="question.type === 'checkbox'">
			    <checkbox-group v-model="question.selectedChoices">
			        <checkbox v-for="(choice, choiceIndex) in question.choices" :key="choiceIndex" :value="choice.value">
			            {{ choice.label }}
			        </checkbox>
			    </checkbox-group>
			</template>
		</view>
		<view style="position: fixed; bottom: 0; width: 100%;">
					<button @click="submitAnswersToServer">提交</button>
				</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data() {
			return {
				questions: []
			};
		},
		onLoad() {
			_self = this;
		},
		onShow: function() {
			var id = uni.getStorageSync('TASK_MANAGER_ID')
			_self.getTasktemplate(id)
		},
		methods: {

			//获取服务器的问卷列表模版
			async getTasktemplate(userid) {

				let data = {
					"id": 3,
					"userId": userid
				}
				const res = await this.$myRequest({
					url: 'tasktemplate/get',
					method: "POST",
					data: JSON.stringify(data),
				})

				if (res.data.code == 0) {
					//username
					console.log("id==", res.data.data.id)
					console.log("updated_at==", res.data.data.updated_at)
					console.log("success==", res)
					console.log("content==", res.data.data.content.questions)

					//console.log("content==leng", res.data.data.content.questions)

					_self.questions = res.data.data.content.questions;

				} else {
					this.$showToast("获取问卷列表失败!")
					console.log("res==", res)
				}
			},
			submitAnswersToServer() {
			    let textAnswers = [];
			
			    this.questions.forEach(question => {
			        if (question.type === 'text' || question.type === 'comment') {
			            textAnswers.push({ title: question.title, answer: question.answerVal || question.value });
			        }
			    });
			
			    // 输出每道文本题的答案
			    textAnswers.forEach((answer, index) => {
			        console.log(`Question ${index + 1}: ${answer.title} - Answer: ${answer.answer}`);
			    });
			
			    // 在这里你可以将整个答案数据 textAnswers 发送到服务器端
			    console.log('提交的答案：', textAnswers);
			}
		}
	};
</script>

<style scoped>
	/* 样式可以根据需要进行自定义 */
</style>