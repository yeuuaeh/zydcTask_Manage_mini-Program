<template>
	<!-- 表单组件 -->
	<view scroll-y="true" class="fromListItem-wrap" v-if="showE">
		<view class="titleInfo" v-if="titleInfo" v-text="titleInfo"></view>
		<view class="cell-box" v-for="(item, index) in option" :key="index">
			<view
				class="sm-box"
				:class="[arrItem.type !== 'radio' && arrItem.type !== 'checkbox' ? 'not_radio_checkbox' : 'is_radio_checkbox', arrItem.className]"
				v-for="(arrItem, arrIndex) in item"
				:key="arrIndex">
				<!-- 除了单/多选外 -->
				<view class="sm-box-cell" v-if="arrItem.type !== 'radio' && arrItem.type !== 'checkbox'">
					<image class="aft-icon" v-if="arrItem.aftItcon" :src="'../static/'+arrItem.aftItcon"></image>

					<view class="name" v-if="arrItem.name && arrItem.type !== 'href'" v-text="arrItem.name"></view>
					<view class="name" v-if="arrItem.name && arrItem.type === 'href'" v-text="arrItem.name" @tap="moreIconEvent(arrItem, `selector_${index}_${arrIndex}`)"></view>

					<!-- 身份证需要用view显示 因为需要中间隐藏数字 -->
					<view
						class="value"
						v-if="arrItem.readyOnly === true && (arrItem.kind === 'IDNumber' || arrItem.kind === 'date' || arrItem.kind === 'choose')"
						:style="{ color: arrItem.textColor ? arrItem.textColor : '#333' }"
						v-text="changeText(arrItem)"
					></view>

					<!-- 输入框 -->
					<input
						v-if="
							arrItem.type !== 'choose' &&
								arrItem.type !== 'choose_radio' &&
								arrItem.type !== 'switch' &&
								arrItem.type !== 'linkage' &&
								arrItem.type !== 'captcha' &&
								arrItem.type !== 'href' &&
								arrItem.readyOnly !== true
						"
						class="value"
						:type="arrItem.kind ? arrItem.kind : 'text'"
						:maxlength="arrItem.maxlength ? arrItem.maxlength : 140"
						:value="arrItem.value"
						:disabled="arrItem.readyOnly"
						:placeholder="arrItem.placeholder"
						placeholder-style="color:#999;font-size:34rpx"
						@input="arrItemChange($event, arrItem)"
						@confirm="arrItemChange($event, arrItem)"
					/>

					<!-- 只读的输入框 -->
					<input
						v-if="
							arrItem.type !== 'choose' &&
								arrItem.type !== 'choose_radio' &&
								arrItem.type !== 'switch' &&
								arrItem.type !== 'linkage' &&
								arrItem.type !== 'captcha' &&
								arrItem.readyOnly === true
						"
						class="value"
						:type="arrItem.kind ? arrItem.kind : 'text'"
						:maxlength="arrItem.maxlength ? arrItem.maxlength : 140"
						:value="arrItem.value"
						:disabled="arrItem.readyOnly"
						:placeholder="arrItem.placeholder"
						placeholder-style="color:#b3b3b3;font-size:28rpx"
						@input="arrItemChange($event, arrItem)"
						@confirm="arrItemChange($event, arrItem)"
						@tap="href($event, arrItem)"
					/>

					<!-- 验证码 -->
					<view class="captcha-wrap" v-if="arrItem.type === 'captcha'">
						<input
							v-if="arrItem.check"
							class="value"
							:type="arrItem.kind ? arrItem.kind : 'text'"
							:maxlength="arrItem.maxlength ? arrItem.maxlength : 6"
							:value="arrItem.value"
							:placeholder="arrItem.placeholder"
							placeholder-style="color:#b3b3b3;font-size:28rpx"
							@input="arrItemChange($event, arrItem)"
							@confirm="arrItemChange($event, arrItem)"
						/>
						<view class="get-captcha-btn" @tap="href($event, arrItem)">
							<text :style="{ color: arrItem.btnTextColor ? arrItem.btnTextColor : '#333' }" v-text="arrItem.btnText"></text>
						</view>
					</view>

					<!-- 选择组件 -->
					<input
						v-if="(arrItem.type === 'choose' || arrItem.type === 'linkage') && arrItem.readyOnly !== true"
						type="text"
						class="value"
						disabled
						:type="arrItem.kind ? arrItem.kind : 'text'"
						:value="arrItem.valueText !== undefined ? arrItem.valueText : arrItem.value"
						:placeholder="arrItem.placeholder ? arrItem.placeholder : `请选择${arrItem.name}`"
						placeholder-style="color:#b3b3b3;font-size:28rpx"
						@tap="selectClickEvent(arrItem, `selector_${index}_${arrIndex}`)"
					/>

					<!-- 开关选择 -->
					<view class="switch-wrap" v-if="arrItem.type === 'switch'">
						<switch
							color="#3B9BFF"
							:checked="arrItem.checked === true ? true : false"
							:disabled="arrItem.disabled === true ? true : false"
							@change="switch1Change($event, arrItem)"
						/>
					</view>

					<!-- 自定义单选 -->
					<view class="choose_radio-wrap" v-if="arrItem.type === 'choose_radio'">
						<view class="radio-wrap">
							<label class="radio" v-for="(radioItem, radioIndex) in arrItem.array" :key="radioIndex" @tap="slectArrItemClickEvent(arrItem, radioItem, radioIndex)">
								<image class="radioImage" :src="radioItem.check ? danxuan_xuanzhong : danxuanhou_weixuanzhong"></image>
								<text v-text="radioItem.name"></text>
							</label>
						</view>
					</view>

					<view class="unit" v-if="arrItem.unit" v-text="arrItem.unit"></view>
					<view
						class="moreIcon-wrap"
						v-if="arrItem.type === 'choose' || arrItem.type === 'href' || arrItem.type === 'address' || arrItem.type === 'linkage'"
						@tap="moreIconEvent(arrItem, `selector_${index}_${arrIndex}`)"
						:style="{ padding: arrItem.callBack ? '20rpx 30rpx 20rpx 15rpx' : '' }"
					>
						<image v-if="arrItem.readyOnly !== true" class="moreIcon" :src="moreIcon"></image>
					</view>
				</view>

				<view class="info-wrap" v-if="arrItem.info" v-text="arrItem.info" @tap="moreIconEvent(arrItem, `selector_${index}_${arrIndex}`)"></view>

				<!-- 单选/多选 -->
				<view class="sm-box-cell" v-if="arrItem.type === 'radio' || arrItem.type === 'checkbox'">
					<view class="title" v-text="arrItem.title"></view>
					<!-- 循环选项 -->
					<view class="arrayItem">
						<view
							class="sm-box"
							v-for="(slectArrItem, slectArrIndex) in arrItem.array"
							:key="slectArrIndex"
							:class="slectArrItem.name === '其它' && slectArrItem.check ? 'other' : ''">
							<text class="text" :class="slectArrItem.check ? 'on' : 'off'" v-text="slectArrItem.name" @tap="slectArrItemClickEvent(arrItem, slectArrItem, slectArrIndex)"></text>
							<input
								v-if="slectArrItem.name === '其它' && slectArrItem.check"
								type="text"
								v-model="slectArrItem.value"
								placeholder="请输入补充内容"
								placeholder-style="color:#b3b3b3;font-size:28rpx"
								@input="slectArrItemChange($event, arrItem, slectArrItem)"
								@confirm="slectArrItemChange($event, arrItem, slectArrItem)"
							/>
						</view>
					</view>
				</view>	
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 多级联动选择后 会存放在selectObj
 * 单选
 *type: 'choose_radio',
						name: '性别',
						placeholder: '请选择性别',
						array: [
							{
								name: '男',
								value: 1
							},
							{
								name: '女',
								value: 2
							}
						]
						
	 // 多选
	 - 清除自动以输入框的值
	 name:'其它'
	 kind: other
	- 反选标识
	name:'其它'(无规定名)
	kind:'negation'	 
	
	 {
	 	type: 'checkbox',
		kind:undefnd,
	 	title: '慢性病',
	 	// readyOnly: true,
	 	array: [],
	 	target: 'chronicDisease'
	 }
 * */

const moreIcon = '../static/gengduo2x.png';
const danxuan_xuanzhong = '../static/danxuan_xuanzhong2x.png';
const danxuanhou_weixuanzhong = '../static/danxuanhou_weixuanzhong2x.png';
export default {
	name: 'fromListItem',
	components: {
		
	},
	props: {
		option: {
			type: Array,
			required: true
		},
		titleInfo: {
			type: String,
			required: false
		}
	},
	watch: {
		option(newVal) {
			this.$emit('update:option', newVal);
		}
	},
	data() {
		return {
			moreIcon,
			danxuan_xuanzhong,
			danxuanhou_weixuanzhong,
			startYear: null,
			endYear: null,
			defaultVal: null,
			showE: false
		};
	},
	created() {
		
		let oDate = new Date();
		let year = oDate.getFullYear();
		let month = oDate.getMonth();
		let day = oDate.getDate();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		this.startYear = year;
		this.endYear = year + 2;
		//例子 2018-02-15
		this.defaultVal = `${year}-${month}-${day}`;

		this.setDef();
		this.showE = true;
	},
	methods: {
		setDef() {
			let item;
			let cellItem;
			let arrayItem;
			for (let i in this.option) {
				item = this.option[i];

				for (let k in item) {
					cellItem = item[k];

					if (cellItem.type === 'radio') {
						if (typeof cellItem['value'] === 'undefined') {
							cellItem['value'] = null;
						}

						if (typeof cellItem['arrayIndex'] === 'undefined') {
							cellItem['arrayIndex'] = null;
						}
					} else if (cellItem.type === 'checkbox') {
						if (typeof cellItem['value'] === 'undefined') {
							cellItem['value'] = [];
						}
					} else if (cellItem.type === 'linkage') {
						if (typeof cellItem['value'] === 'undefined') {
							cellItem['value'] = [];
						}

						if (typeof cellItem['value'] === 'undefined') {
							cellItem['valueText'] = '';
						}
					} else if (cellItem.type === 'captcha') {
						if (typeof cellItem['check'] === 'undefined') {
							cellItem['check'] = false;
						}
					}

					if (cellItem.array && cellItem.array.length) {
						for (let l in cellItem.array) {
							arrayItem = cellItem.array[l];
							
							if (typeof arrayItem['check'] === 'undefined') {
								arrayItem['check'] = false;
							}

							if (arrayItem.name === '其它') {
								arrayItem['value'] = '';
							}
						}
					}
				}
			}
			this.$emit('update:option', this.option);
		},
		arrItemChange(e, arrItem) {
			arrItem.value = e.detail.value;
			// console.log(arrItem.value ,'arrItem.value arrItem.value arrItem.value arrItem.value ')
			this.$emit('update:option', this.option);
		},
		// 输入框
		slectArrItemChange(e, arrItem, slectArrItem) {
			if (arrItem.type === 'radio') {
				arrItem.value = e.detail.value;
			} else if (arrItem.type === 'checkbox') {
				for (let i in arrItem.value) {
					if (arrItem.value[i].name === slectArrItem.name) {
						arrItem.value[i].value = slectArrItem.value;
						break;
					}
				}
			}

			this.$emit('update:option', this.option);
		},
		// 单多选取值
		slectArrItemClickEvent(arrItem, slectArrItem, slectArrIndex) {
			let arrayItem;
			let valueCell;
			let value;
			let slectArrItemValue = typeof slectArrItem.value !== 'undefined' ? slectArrItem.value : slectArrItem.name;
			let status = true;

			if (typeof arrItem.readyOnly === 'boolean' && arrItem.readyOnly === true) {
				return;
			}

			for (let i in arrItem.array) {
				arrayItem = arrItem.array[i];
				if (arrItem.type === 'radio' || arrItem.type === 'choose_radio') {
					arrayItem.check = false;
					arrItem.value = slectArrItem.value;
					arrItem.valueText = slectArrItem.name;
					arrItem.arrayIndex = slectArrIndex;
				} else if (slectArrItem['kind'] === 'negation' && !slectArrItem.check === true) {
					arrayItem.check = false;
					arrItem.value = [];
				}
			}

			// 暂无按钮 当前选的kind是negation name就只能选这个 其它都取取消
			if (slectArrItem['kind'] === 'negation' && !slectArrItem.check === true) {
				slectArrItem.check = !slectArrItem.check;
				this.$emit('update:option', this.option);
				return;
			} else {
				for (let i in arrItem.array) {
					if (arrItem.array[i]['kind'] === 'negation') {
						arrItem.array[i].check = false;
						break;
					}
				}
			}

			// 其它按钮
			if (slectArrItem['kind'] === 'other' && !slectArrItem.check === false) {
				slectArrItem.value = '';
			}

			if (arrItem.type === 'checkbox') {
				if (!arrItem.value.length) {
					arrItem.value.push(slectArrItem);
				} else {
					for (let i in arrItem.value) {
						valueCell = arrItem.value[i];
						value = typeof valueCell.value !== 'undefined' ? valueCell.value : valueCell.name;
						status = true;
						if (value === slectArrItemValue) {
							status = false;
							arrItem.value.splice(i, 1);
							break;
						}
					}
					if (status) {
						arrItem.value.push(slectArrItem);
					}
				}
			}
			
			slectArrItem.check = !slectArrItem.check;
				
			this.$emit('update:option', this.option);
		},
		// 选择组件被单击的事件
		selectClickEvent(item, str) {
			uni.hideKeyboard();
			if (item.readyOnly === true) {
				return;
			}

			if (item.selectArr) {
				if (!item.selectArr.length) {
					return uni.showToast({
						title: '暂无数据',
						icon: 'none'
					});
				}
				this.$refs[str][0].show();
			} else if (item.type === 'linkage') {
				if (!item.options.length) {
					return uni.showToast({
						title: '暂无数据',
						icon: 'none'
					});
				}
				this.$refs[str][0].show();
			} else if (item.kind === 'date') {
				this.$refs[str][0].show();
			}
			this.$emit('update:option', this.option);
		},
		// 单选组件的回调
		selectCallBlack(res, item, index) {
			item.valueText = res.result;
			item.value = res.obj.value;
			this.$emit('update:option', this.option);

			if (item.selectCallBlack) {
				this.$emit(item.selectCallBlack, { res, item, index });
			}
		},
		// 大于号的点击事件
		moreIconEvent(arrItem, str) {
			// console.log(arrItem, 'arrItemarrItem');
			if (arrItem.callBack) {
				this.$emit(arrItem.callBack);
			}
		},
		// 开关选择器回调
		switch1Change(e, arrItem) {
			let value = e.target.value;
			arrItem.value = value;
			console.log(value);
			this.$emit('update:option', this.option);
		},
		href($event, arrItem) {
			// console.log(arrItem);
			if (arrItem.callBack) {
				this.$emit(arrItem.callBack, arrItem);
			}
			this.$emit('update:option', this.option);
		},
		// 日期选择
		selectDateCallBlack(val, item, index) {
			console.log(val);
			item.value = val.result;
			this.$emit('update:option', this.option);
		},
		onChange($event, arrItem) {
			if (arrItem.changeCallBack) {
				this.$emit(arrItem.changeCallBack, $event);
			}
		},
		// 联动事件
		onConfirm($event, arrItem, arrIndex, linkage) {
			let res = $event;
			let type = arrItem.type;

			// 自定义多级联动
			if (type === 'linkage') {
				// console.log(arrItem);
				let obj = $event.obj;
				let colItem;
				arrItem.valueText = '';
				for (let i in obj) {
					colItem = obj[i];

					if (colItem.name) {
						if (arrItem.valueText && arrItem.valueText.length) {
							arrItem.valueText += '-' + colItem.name;
						} else {
							arrItem.valueText = colItem.name;
						}
					}
				}
				arrItem.value = res.value;
				arrItem.selectObj = res;
			} else {
				arrItem.value = res.result;
			}
			this.$emit('update:option', this.option);
			// console.log(arrItem);
			// console.log(type);
		},
		onCancel($event, arrItem) {
			if (arrItem.cancelCallBack) {
				this.$emit(arrItem.cancelCallBack, $event);
			}
		},
		changeText(arrItem) {
			let val = arrItem.value;
			let valueText = arrItem.valueText;
			let kind = arrItem.kind;
			let placeholder = arrItem.placeholder;
			let readyOnly = arrItem.readyOnly;

			if (kind === 'idNumber') {
				if (val.length === 2) {
					val = val.substr(0, 1) + '*';
				} else if (val.length > 2) {
					let char = '';
					for (let i = 0, len = val.length - 10; i < len; i++) {
						char += '*';
					}
					val = val.substr(0, 6) + char + val.substr(-4, 4);
				} else {
					val = val;
				}
			} else if (kind === 'date' || kind === 'choose') {
				// 优先使用valueText 因为value时候是值
				if (valueText) {
					val = valueText;
					arrItem.textColor = '#333';
				} else if (val) {
					val = val;
					arrItem.textColor = '#333';
				} else {
					val = placeholder;
					arrItem.textColor = '#b3b3b3';
				}
			}

			return val;
		}
	}
};
</script>

<style lang="scss" scoped>
.fromListItem-wrap {
	// height: 100%;
	background-color: #f5f5f5;

	.titleInfo {
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		height: 50rpx;
		font-size: 24rpx;
		color: #808080;
	}

	.radioImage {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}

	.aft-icon {
		width: 30rpx;
		height: 30rpx;
		margin-right: 18rpx;
	}

	.cell-box {
		overflow: hidden;
		background-color: #fff;
		&:not(:last-child) {
			margin-bottom: 30rpx;
		}

		.sm-box {
			.sm-box-cell {
				min-height: 140rpx;
			}

			.info-wrap {
				padding: 0 30rpx 30rpx;
				font-size: 28rpx;
				color: #b3b3b3;
			}

			&.not_radio_checkbox {
				border-bottom-width: 1rpx;
				border-bottom-style: solid;
				border-bottom-color: #e4e7ea;
				.sm-box-cell {
					display: flex;
					align-items: center;
					.name {
						padding: 15rpx 0;
						display: flex;
						justify-content: flex-start;
						flex: 4;
						font-size: 30rpx;
						color: #333;
					}
					.value {
						font-size: 34rpx;
						color: #333;
						flex: 8;
						text-align: left;
					}
					.radio-wrap {
						display: flex;
						align-items: center;

						label {
							display: flex;
							align-items: center;
							font-size: 28rpx;
							color: #333;

							&:not(:last-child) {
								margin-right: 20rpx;
							}
						}
					}
					.captcha-wrap {
						display: flex;
						align-items: center;
						margin-right: 30rpx;
						.get-captcha-btn {
							margin-left: 10rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							padding: 0 15rpx;
							height: 60rpx;
							border-radius: 20rpx;
							border-width: 1rpx;
							border-style: solid;
							border-color: #e5e5e5;
							text {
								font-size: 26rpx;
								color: #333;
							}
						}
					}
					.unit {
						display: flex;
						align-items: center;
						justify-content: center;
						min-width: 50rpx;
						font-size: 30rpx;
						margin-left: 5rpx;
					}

					.moreIcon-wrap {
						.moreIcon {
							width: 16rpx;
							height: 28rpx;
							margin-left: 10rpx;
						}
					}

					.switch-wrap {
						switch {
							position: relative;
							right: -13px;
							transform: scale(0.7);
						}
					}
				}
			}

			&.is_radio_checkbox {
				// padding: 30rpx 0;
				&:first-child {
					margin-top: 20rpx;
				}
				.sm-box-cell {
					padding: 0 0 0 30rpx;
					.title {
						margin-bottom: 20rpx;
						color: #333;
						font-size: 30rpx;
					}

					.arrayItem {
						display: flex;
						flex-wrap: wrap;
						.sm-box {
							&:not(:last-child) {
								margin-right: 22rpx;
							}
							.text {
								display: flex;
								align-items: center;
								justify-content: center;
								min-width: 134rpx;
								padding: 10rpx 10rpx;
								margin-bottom: 24rpx;
								color: #808080;
								font-size: 28rpx;
								border-radius: 40rpx;
								background-color: #f7f7f7;

								&.on {
									color: #fff;
									font-size: 28rpx;
									background-color: #6bb3fe;
								}

								.off {
									color: #808080;
									font-size: 28rpx;
									background-color: #f7f7f7;
								}
							}
						}

						.other {
							display: flex;
							align-items: center;
							flex: 100%;
							height: 60rpx;
							margin-bottom: 20rpx;
							.text {
								margin-bottom: 0;
							}
							input {
								width: 400rpx;
								margin-left: 20rpx;
								height: 100%;
								border-width: 1rpx;
								border-style: solid;
								border-color: #e5e5e5;
								padding-left: 22rpx;
								border-radius: 10rpx;
								font-size: 28rpx;
							}
						}
					}
				}
			}
		}
	}
}
</style>
