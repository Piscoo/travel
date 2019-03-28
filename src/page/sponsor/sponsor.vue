<template>
	<div class="sponsor">
		<form ref="form">
			<group class="baseInfo" gutter="0">
				<!-- :is-type="testFun" -->
				<x-input
					title="姓名:"
					name="userName"
					v-model="form.userName"
					type="text"
					placeholder="请填写真实姓名"
					required
				>
					<span slot="right" class="eva-tip">*</span>
				</x-input>
				<x-input
					title="手机号码:"
					name="phone"
					v-model="form.phone"
					type="number"
					is-type="china-mobile"
					placeholder="请填写真实手机号"
					required
				>
					<span slot="right" class="eva-tip">*</span>
				</x-input>
				<x-input
					title="活动名称:"
					name="title"
					v-model="form.title"
					type="text"
					placeholder="请填写活动名称"
					required
				>
					<span slot="right" class="eva-tip">*</span>
				</x-input>
				<x-input
					title="支持宣言:"
					name="supportDecl"
					v-model="form.supportDecl"
					type="text"
					placeholder="宣言将附在banner上"
					required
				>
					<span slot="right" class="eva-tip">*</span>
				</x-input>
				<popup-picker
					title="类别："
					:data="typeList"
					:columns="1"
					v-model="actionType"
					placeholder="请选择类别"
					confirm-text="确定"
					show-name
				></popup-picker>
			</group>

			<group class="companyInfo">
				<x-input
					title="支持金额:"
					name="supportAmount"
					v-model="form.supportAmount"
					placeholder="请填写支持金额"
					required
					type="number"
				>
					<span slot="right" class="eva-tip">*</span>
				</x-input>
				<datetime
					title="设置开始时间："
					:start-date="dateFormat(new Date(), 'YYYY-MM-DD')"
					v-model="form.startTime"
					:end-date="form.endTime"
				></datetime>
				<datetime title="设置结束时间：" v-model="form.endTime" :start-date="startEndTime"></datetime>
			</group>
			<div class="poster">
				<div class="title">宣传海报</div>
				<label for="uploadFile" class="cover-img" :style="'background-image: url('+(form.imgsPath||poster)+')'">
					<!-- <img src="~assets/pisco/ph_three.png" alt=""> -->
					<div class="upload">
						<span v-show="!uploading">点击可海报</span>
						<span v-show="uploading">上传中  <inline-loading></inline-loading></span>
					</div>
				</label>
				<input type="file" id="uploadFile" @change="uploadFile" class="visibility-none">
			</div>
		</form>
		<div class="notice">
			<div class="title">代言须知</div>
			<div class="detail">您的好友可以代言您的活动在朋友圈推广,通过他的推广获得的支持可以按照一定的比例分润,在支持成功的条件下,分润将自动返回到好友钱包</div>
		</div>
		<div class="next" @click="sendtest">已阅“支持须知” 继续下一步</div>
	</div>
</template>
<script>
import { Group, XInput, Selector, PopupPicker, Datetime, InlineLoading } from "vux";
import { dateFormat } from "vux";
import { debug } from 'util';
export default {
	components: { Group, XInput, Selector, PopupPicker, Datetime, InlineLoading },
	methods: {
		/**
		 * [sendtest] 点击去往下一步页面edit.vue
		 * @return {[type]} [description]
		 * 存储当前页面填写的数据 this.form
		 */
		sendtest() {
			if (this.formValid()) {
				localStorage.setItem("sponsorForm", JSON.stringify(this.form));
				this.$router.push({
					path: "/edit",
					name: "actionedit"
				});
			}
		},
		// 上传海报图
		uploadFile(e) {
			var file = e.target.files[0];
			this.poster = URL.createObjectURL(e.target.files[0]);
			var formData = new FormData();
			formData.append("file", file);
			this.uploading = true
			this.ajax({
				method: "post",
				url: "/app/oss/upload",
				data: formData,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
				},
				success: res => {
					this.form.imgsPath = res.url
				},
				complete: res => {
					this.uploading = false
				}
			})
		},
	},
	beforeCreate() {
		dateFormat(new Date(Date.now()+ 24*60*60*1000), 'YYYY-MM-DD')
		this.$store.commit("updateTabbar", { tabbar: -1 });
		this.$nextTick(function () {
			let sponsorForm = localStorage.getItem("sponsorForm")
			if (sponsorForm) {
				this.form =  JSON.parse(sponsorForm)
			}
		})
	},
	watch: {
		/**
		 * [actionType 选择类别数组转form数据]
		 * @type {Object}
		 */
		actionType: {
			handler(val) {
				this.form.type = val[0];
				this.form.type = Number(this.form.type);
			},
			deep: true
		},
		'form.startTime': function (val) {
			this.startEndTime = dateFormat(new Date((new Date(val)).getTime() + 24*60*60*1000), 'YYYY-MM-DD')
		}
	},
	data() {
		return {
			requires: ["userName", "phone", "title", "supportDecl", "supportAmount", "endTime|请选择结束时间!", "imgsPath|请上传海报!"], // 必填校验
			form: {
				userName: "", //姓名
				phone: "", //手机号码
				title: "", //活动名称
				supportDecl: "", //支持宣言
				supportAmount: "", //支持金额
				type: 2, // 活动类别编号
				imgsPath: "", // 后台返回的海报图地址
				startTime: dateFormat(new Date(), 'YYYY-MM-DD'),// 开始时间
				endTime:  ""// 结束时间
			},
			// 限制结束时间最小值
			startEndTime: dateFormat(new Date(Date.now()+ 24*60*60*1000), 'YYYY-MM-DD'), 
			poster: require("~assets/pisco/ph_three.png"), //默认海报图
			actionType: ['2'], // 活动类别
			uploading: false, // 是否正在上传图片
			typeList: [
				// { name: "官方活动", value: "1", parent: 0 },
				{ name: "户外活动", value: "2", parent: 0 },
				{ name: "产品消费", value: "3", parent: 0 },
				{ name: "爱心公益", value: "4", parent: 0 },
				{ name: "宴会活动", value: "5", parent: 0 },
				{ name: "众筹活动", value: "6", parent: 0 }
			]
		};
	}
};
</script>
<style lang="less" scoped>
	.sponsor {
		min-height: 100%;
		background: #eee;
		.baseinfo {
			padding-top: 0 !important;
		}
		.poster {
			margin-top: 1.25rem;
			background: #fff;
			padding: 1rem;
			.title {
				font-size: 1.42rem;
				color: #414141;
			}
			.cover-img {
				display: block;
				width: 100%;
				height: 14rem;
				position: relative;
				margin-top: 1.25rem;
				.upload {
					height: 3.67rem;
					width: 100%;
					line-height: 3.67rem;
					text-align: center;
					color: #f8c301;
					font-size: 1.25rem;
					position: absolute;
					bottom: 0;
					background: rgba(0, 0, 0, 0.2);
				}
			}
		}
		.notice {
			padding: 1.25rem;
			.title {
				color: #f8c301;
				font-size: 1.25rem;
			}
			.detail {
				font-size: 1rem;
				color: #c8c8c8;
				margin-top: 0.83rem;
			}
		}
		.next {
			width: 100%;
			height: 4.17rem;
			background: #f8c301;
			color: #414141;
			font-size: 1.42rem;
			line-height: 4.17rem;
			text-align: center;
		}
	}
</style>
