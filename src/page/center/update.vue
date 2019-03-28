<template>
	<div>
		<form ref="form">
			<group class="baseInfo" gutter="0">
				<x-input title="姓名:"  :max="5" v-model="form.userName" name="userName" placeholder="请填写真实姓名" :disabled="disableName" required></x-input>
				<popup-picker title="性别:" :data="sexList" v-model="sexType" placeholder="请选择性别" confirm-text="确定" :disabled="disableName"></popup-picker><!--  mask="999 9999 9999" :max="11" -->
				<x-input title="手机号:" v-model="form.mobile" type="number" placeholder="请填写手机号" :disabled="disablePhone" is-type="china-mobile" name="mobile" required> <span slot="right" @click="getVerificationCode">{{VerificationCodeTie}}</span>
				</x-input>
				<x-input title="验证码:" v-model="form.verificationCode" keyboard="number" type="number" placeholder="请填写验证码" @on-blur="sendVerificationCode" name="verificationCode" :is-type="checkVerificationCode" required>
					<span slot="right" :style="{'color':verificationCode==1 ? 'green':'red'}" v-if="verificationCode==1 || verificationCode==2">验证{{verificationCodeText}}！</span>
				</x-input>
				<x-input title="身份证:" :max="18" v-model="form.identity" placeholder="请填写身份证号码" :disabled="disableAll"  name="identity" :is-type="checkIdcard" required></x-input><!--   -->
			</group>
			<group class="companyInfo">
				<x-input title="公司名称:" :max="18" v-model="form.companyName" placeholder="请填写公司名称" :disabled="disableAll" name="companyName" required></x-input>
				<popup-picker title="职位:" :data="occupationList" v-model="occupationType" placeholder="请选择职位" confirm-text="确定" :disabled="disableAll"></popup-picker>
				<popup-picker title="行业:" :data="industryList" v-model="industryType" placeholder="请选择行业" confirm-text="确定" :disabled="disableAll"></popup-picker>
				<popup-picker title="区域:" :data="areaList" v-model="areaType" placeholder="请选择区域" confirm-text="确定" :disabled="disableAll"></popup-picker>
				<x-input title="紧急联系人:" :max="8" v-model="form.emergencyContactName" placeholder="请填写紧急联系人" :disabled="disableAll" name="emergencyContactName" required></x-input>
				<x-input title="紧急联系人号码:" type="number" v-model="form.emergencyContactPhone" placeholder="请填写紧急联系人号码" is-type="china-mobile" :disabled="disableAll" name="emergencyContactPhone" required></x-input> <!-- mask="999 9999 9999" :max="13" -->
			</group>
		</form>
	</div>
</template>
<script>
import { Group, XInput, Selector, PopupPicker, Toast } from "vux";
import { log } from "util";
import { setInterval, clearTimeout } from "timers";
export default {
	name: "update",
	components: {
		Group,
		XInput,
		Selector,
		PopupPicker,
		Toast
	},
	beforeCreate() {
		this.$store.commit("updateTabbar", {
			tabbar: 3
		});
		this.$store.commit("updateShowBack", {
			showBack: true
		});
		this.$store.commit("updateShowMore", {
			showMore: "保存"
		});
		// this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
		this.ajax({
			method: "get",
			url: "/app/user",
			data: {},
			success: res => {
				console.log("个人", res.data)
				if (res.data.disableUserName == 1) {
					this.disableName = true
				}
				if (res.data.mobile) {
					this.disablePhone = true
				}
				if (res.data.identity || res.data.companyName || res.data.occupation || res.data.industry || res.data.area || res.data.emergencyContactName || res.data.emergencyContactPhone) {
					this.disableAll = true
				}
				if (res.data.sex || res.data.sex == 0) {
					var arr = [];
					arr.push(res.data.sex == 1 ? "男" : "女");
					this.sexType = arr;
				}
				if (res.data.occupation) {
					var arr1 = [];
					arr1.push(res.data.occupation);
					this.occupationType = arr1;
				}
				if (res.data.industry) {
					var arr2 = [];
					arr2.push(res.data.industry);
					this.industryType = arr2;
				}
				if (res.data.area) {
					var arr3 = [];
					arr3.push(res.data.area);
					this.areaType = arr3;
				}
				this.form = res.data
			}
		});
		this.$nextTick( () => {
			this.updateType = this.$route.params.updateType
			this.activityId = this.$route.params.activityId
		})
	},
	watch: {
		/**
		 * [actionType 选择类别数组转form数据]
		 * @type {Object}
		 */
		sexType: {
			handler(val) {
				this.form.sex = val[0] === "男" ? 1 : 2;
			},
			deep: true
		},
		occupationType: {
			handler(val) {
				this.form.occupation = val[0];
			},
			deep: true
		},
		industryType: {
			handler(val) {
				this.form.industry = val[0];
			},
			deep: true
		},
		areaType: {
			handler(val) {
				this.form.area = val[0];
			},
			deep: true
		},
		verificationCode: {
			handler(val) {
				this.verificationCodeText = val == 1 ? "成功" : "失败";
			},
			deep: true
		}
	},
	methods: {
		saveUserInfo() {
			// if (this.disabled) {
			// 	this.disabled = false;
			// 	this.$store.commit("updateShowMore", {
			// 		showMore: "保存"
			// 	});
			// 	return false;
			// }
			if (this.verificationCode == -1) {
				this.sendVerificationCode.next = true;
			} else if (this.verificationCode !== 1) {
				return this.$vux.toast.show({
					text: "验证码错误",
					type: "cancel"
				});
			}
			if (this.formValid()) {
				this.ajax({
					method: "put",
					url: "/app/user",
					data: this.form,
					success: res => {
						if (res.code == 0) {
							this.$vux.toast.show({
								text: "保存成功"
							});
							// this.disabled = true;
							// this.$store.commit("updateShowMore", {
							// 	showMore: "编辑"
							// });
							if (this.updateType == 1) {
								this.ajax({
									method: 'post',
									url: '/app/user/activities/'+ this.activityId,
									data: {activityId: this.activityId},
									success: res => {
										this.$vux.toast.text('报名成功！')
										this.$router.push({
											name: "activitydetail",
											params: {
												activityType: 6,
												activityId: res.data.activityId
											}
										})
									}
								})
							} else {
								this.$router.back(-1)
								// window.history.back(-1)
							}
						} else {
							this.$vux.toast.show({
								text: "保存失败",
								type: "cancel"
							});
						}
					},
					fail: res => {
						this.$vux.toast.show({
							width: "10em",
							text: res.msg,
							type: "cancel"
						});
					}
				});
			}
		},
		getVerificationCode() {
			if (
				!/^\d{11}$/.test(this.form.mobile)
			) {
				return this.$vux.toast.show({
					text: "请输入正确的手机号码",
					type: "cancel"
				})
			}
			this.VerificationCodeTie = "发送中...";
			this.countDownNumber = 60;
			this.ajax({
				method: "post",
				url: "/app/user/sendsms",
				data: {
					phoneNumber: this.form.mobile,
					nationCode: "86"
				},
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success: res => {
					this.countDown();
				}
			});
		},
		sendVerificationCode() {
			if (/^\d{6}$/.test(this.form.verificationCode) && /^\d{11}$/.test(this.form.mobile)) {
				this.ajax({
					method: "post",
					url: "/app/user/verifysms",
					data: {
						verificationCode: this.form.verificationCode
					},
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					success: res => {
						if (res.code == 0) {
							this.verificationCode = 1;
							if (this.sendVerificationCode.next) {
								this.sendVerificationCode.next = null
								// this.saveUserInfo()
							}
						} else {
							this.verificationCode = 2;
						}
					},
					fail: res => {
						this.verificationCode = 2;
					}
				});
			} else {
				return;
			}
		},
		countDown() {
			var timer = setInterval(() => {
				this.countDownNumber--;
				this.clickEvent = 2;
				this.VerificationCodeTie = this.countDownNumber + "s";
				if (this.countDownNumber <= 0) {
					timer.close();
					this.clickEvent = 1;
					this.VerificationCodeTie = "重发验证码";
				}
			}, 1000);
		},
		checkIdcard(value) {
			//身份证验证增加括号， 放宽限制，允许 10-18位
			var reg = /^[A-Za-z0-9\(\)]{10,18}$/
			// var reg = /(^[A-Za-z0-9]{10}$)|(^[A-Za-z0-9]{11}$)|(^[A-Za-z0-9]{18}$)/
			// var reg = /(^\d{11}$)|(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if (reg.test(value)) {
				return { valid: true }
			} else {
				return { valid: false, msg: "身份证格式错误" }
			}
		},
		checkVerificationCode(value) {
			if (/^\d{6}$/.test(value)) {
				return { valid: true }
			} else {
				return { valid: false, msg: "验证码不对" }
			}
		}
	},
	created() {
		this.$store.commit("updateClickMore", {
			onClickMore: this.saveUserInfo
		});
		this.$vux.toast.show({
			type: "text",
			text: "以上个人信息事关赛事的后期服务及保险购买，务必填写真实个人信息，一经确定个人无法更改，若需更改请联系组委会！",
			time: 3600,
			width: "20rem",
			position: "top"
		})
	},
	data() {
		return {
			areaList: [
				["东北", "华东", "华北", "华中", "华南", "西南", "西北"]
			],
			occupationList: [
				[
					"董事长",
					"董秘",
					"CEO",
					"CTO",
					"CFO",
					"COO",
					"CHO",
					"总经理",
					"副总经理",
					"部长/部门经理",
					"副部长/部门经理/代理经理",
					"总助",
					"主任/主管",
					"主办",
					"组长",
					"职员"
				]
			],
			industryList: [
				[
					"农、林、牧、渔业",
					"采矿业",
					"制造业",
					"电力、燃气及水的生产和供应业",
					"建筑业",
					" 交通运输、仓储和邮政业",
					"信息传输、计算机服务和软件业",
					"批发和零售业",
					"住宿和餐饮业",
					"金融业",
					"房地产业",
					"租赁和商务服务业",
					"科学研究、技术服务和地质勘查业",
					"水利、环境和公共设施管理业",
					"居民服务和其他服务业"
				]
			],
			sexList: [
				["男", "女"]
			],
			sexType: [],
			updateType: '',
			activityId: '',
			occupationType: [],
			industryType: [],
			areaType: [],
			verificationCode: -1,
			verificationCodeText: "",
			disableName: false,
			disablePhone: false,
			disableAll: false,
			VerificationCodeTie: "发送验证码",
			countDownNumber: 60,
			clickEvent: 1,
			idNumLength: 18,
			form: {
				userName: "",
				sex: "",
				mobile: "",
				verificationCode: "",
				companyName: "",
				emergencyContactName: "",
				emergencyContactPhone: "",
				headUrl: "",
				identity: "",
				industry: "",
				occupation: "",
				area: ""
			},
			requires: [
				"userName",
				"sex",
				"mobile",
				"verificationCode",
				"identity",
				"companyName",
				"emergencyContactName",
				"emergencyContactPhone",
				"occupation|请选择职位!",
				"industry|请选择行业!",
				"area|请选择区域!"
			] //必填字段
		};
	}
};

</script>
<style lang="less" scoped>
.baseInfo {
	background: #fff;
}

/deep/ .header-btn {
	font-size: 1.25rem;
	color: #000;
}

</style>
