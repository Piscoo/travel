<template>
	<div class="newMoney">
		<div class="main">
			<div class="cover-img" :style="'background-image: url('+require('~assets/pisco/signup_icon_unselected@2x.png')+')'"></div>
			<!-- <div class="button"><x-button>返回活动去分享</x-button></div>
			<div class="button"><x-button>查看已参加活动</x-button></div>
			<div class="button"><x-button>返回活动大厅</x-button></div> -->
			<div class="button" @click="toShare">返回活动去分享</div>
			<div class="button"  @click="toMyActivities">查看已参加活动</div>
			<div class="button" @click="toIndex">返回活动大厅</div>
		</div>
		<div class="notice">
			<div class="title">报名须知</div>
			<p>1.报名成功后请尽快邀请您的好友支持, 微信好友参与需要注册成为会员 </p>
			<p>2.支持者付款按活动须知相关说明处理 </p>
			<p>3.及时发布支持进度使得您的支持者了解您参与活动的动态</p>
		</div>
	</div>
</template>
<script>
import { XInput,XButton } from "vux";
export default {
	name: "actionsuccess",
	components: { XInput,XButton },
	methods: {
		//点击前往主页
		toIndex() {
			this.$router.push({
				name: 'index'
			})
		},
		// 点击前往已报名的活动
		toMyActivities() {
			this.$router.push({
				name: 'MyActivity',
				params: { type: 1 }
			})
		},
		// 去活动详情
		toShare() {
			this.$router.push({
				name: 'activitydetail',
				params: { activityId: this.activityId }
			})
		}
	},
	beforeCreate() {
		this.$store.commit("updateTabbar", { tabbar: -1 });
		// this.$store.commit("updateShowBack", { showBack: true });
		this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
		this.$nextTick(() => {
			this.activityId = this.$route.params.activityId
			console.log(this.activityId)
		})
	},
	data() {
		return {
			success: ''
		}
	}
};
</script>
<style lang="less" scoped>
		.newMoney {
			.cover-img {
				width: 8rem;
				height: 8rem;
				margin: 3rem auto;
			}
			.button {
				width:14rem;
				height:2.83rem;
				background:rgba(255,255,255,1);
				border-radius:0.17rem;
				border:1px solid rgba(248,195,1,1);
				margin: 1rem auto;
				line-height: 2.83rem;
				text-align: center;
				color:rgba(248,195,1,1);
				letter-spacing: 2px; 
			}
			.notice {
				margin-top: 5rem;
				padding: 0.83rem;
				font-size:1rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(152,152,152,1);
				line-height:1.67rem;
				.title{
					font-size:1.25rem;
					font-family:PingFang-SC-Medium;
					font-weight:500;
					color:rgba(65,65,65,1);
					line-height:1.67rem;
				}
			}
		}
</style>
