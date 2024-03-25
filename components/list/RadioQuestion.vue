<template>
  <div>
    <h3>{{ question.title }}</h3>
    <div v-for="(choice, i) in question.choices" :key="i">
      <input type="radio" :id="'radio_' + uniqueId() + '_' + i" :value="choice.value" v-model="question.answerVal">
      <label :for="'radio_' + uniqueId() + '_' + i">{{ choice.label }}</label>
    </div>
    <button @click="submitAnswer">提交答案</button>
  </div>
</template>

<script>
import { uniqueId } from '@/utils';

export default {
  props: ['question'],
  methods: {
    submitAnswer() {
      // 处理提交答案的逻辑
      console.log('提交的答案：', this.question.answerVal);
    },
    uniqueId() {
      return uniqueId();
    }
  }
}
</script>