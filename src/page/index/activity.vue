<template>
	<div>
		<!-- 顶部tabbar -->
		<tab :line-width="2" active-color="#F8C301" v-model="index" custom-bar-width="4.58rem">
			<tab-item class="vux-center" v-for="(item, index) in stautsList" :key="index" @on-item-click="changestatus(index)">{{item}}</tab-item>
		</tab>
		<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
			<div class="card-List">
				<div class="panel" v-for="(item, index) in activeList" :key="index">
					<div @click="toDetail(activityType, item.id)">
						<div class="top">
							<div class="top-left">
								<img v-if="item.userHeadUrl" :src="item.userHeadUrl" alt="">
								<img v-else="item.userHeadUrl" src="~assets/kiw/logo@2x.png" alt>
								<div class="partner">
									<p>{{item.userName?item.userName:activityName}}</p>
									<p>{{item.createTime}}</p>
								</div>
							</div>
							<span v-show="item.status !== 2">立即参与</span>
							<span v-show="item.status === 2" style="background:#C8C8C8;color:#fff;">{{item.type==6 ? '众筹完成' : '活动结束'}}</span>
						</div>
						<p class="h2">{{item.title}}</p>
						<div class="cover-img" :style="'background-image: url(' + item.imgsPath + ')'"></div>
					</div>
					<div class="flex space-between">
						<div>
							<!-- <span>
								报名
								<span>{{item.joinCount}}</span>
							</span> -->
							<span v-if="item.type == 6">
								支持
								<span>{{item.supportCount}}</span>
							</span>
						</div>
						<div class="rightinfo">
							<div class="likenum" @click="likeit(item.id, index)">
								<div class="cover-img">
									<img v-show="item.likeEver=='0'||!item.likeEver" src="~assets/pisco/like.png" alt>
									<img v-show="item.likeEver=='1'" src="~assets/pisco/liked.png" alt>
								</div>
								<span>{{item.likeCount}}</span>
							</div>
							<div class="judgenum"  @click="tomessage(item.id)">
								<div class="cover-img"><img src="~assets/pisco/judge.png" alt=""></div>
								<span>{{item.replyCount}}</span>
							</div>
						</div>
					</div>
					<div  style="display:flex;" v-if="item.activityMemberVoList">
						<div class="likes" :class="showmember===index?'':'hidd'">
							<div v-for="(member, index) in item.activityMemberVoList" :key="index" class="joinitem">
								<div class="joinlogo">
									<img :src="member.headUrl" @click="toActivity(index, item.type, member.activityId, member.userId)" />
								</div>
							</div>
						</div>
						<div class="showmore" v-if="item.activityMemberVoList.length>9" v-show="showmember===index?false:true" @click="showmem(index)">
							<div class="dot" v-for="item in 3"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { Tab, TabItem } from "vux";
export default {
	name: "activity",
	components: { Tab, TabItem },
	beforeCreate() {
		this.$store.commit("updateTabbar", { tabbar: -1 });
		this.$store.commit("updateShowBack", { showBack: true });
		this.$nextTick(() => {
		    const typeToText = ["特种旅游", "众筹赛事", "自驾旅游", "品牌合作", "众筹列表"]
			this.activityType = this.$route.params.activityType
			 this.$store.commit("updatePageTitle", { pageTitle:  document.title = typeToText[this.activityType - 2]})
			 this.activityName = typeToText[this.activityType - 2]
			this.getActivities()
		})
		// this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
	},
	methods: {
		/**
		 * [loadMore 加载更多]
		 */
		loadMore: function() {
	      this.getActivities()
	    },
		changestatus(index) {
			// 点击切换查看不同状态的活动  全部 为空  进行中 1  已完成 2
			if (index === 0) {
				this.activityStatus = ''
			} else {
				this.activityStatus = index
			}
			this.activeList = []
			this.getActivities(1)
		},
		//点击头像前往活动详情
		toActivity(index, activityType, activityId, userId) {
			this.activityId = activityId
			this.userId = userId
			this.ajax({
				method: 'get',
				url: '/app/activities/'+activityId+'/user-activity/'+ userId,
				data: {
					activityId: this.activityId,
					userId: this.userId
				},
				success: res => {
					const aimId = res.data.id
					if (aimId) {
						this.$router.push({
							name: 'activitydetail',
							params: {
								activityType,
								activityId: aimId
							}
						})
					}
				}
			})
		},
		// 点击省略号显示全部报名人
		showmem(index) {
			this.showmember = index
		},
		// 点击前往对应活动详情，携带参数：活动类型，活动ID
		toDetail(activityType, activityId) {
			this.$router.push({
				name: 'activitydetail',
				params: {
					activityType,
					activityId
				}
			})
		},
		// 获取对应类型的所有活动
		getActivities (pageNo) {
			const pageNum = pageNo || this.pageNum
			this.busy = true
			this.ajax({
				method: "get",
				url: "/app/activities",
				data: {
					activityType: this.activityType,
					pageNum,
					activityStatus: this.activityStatus,
					pageSize: this.pageSize
				},
				success: res => {
					if (res.data) {
						this.pageNum = pageNum + 1
						this.activeList =  this.activeList.concat(res.data.list || [])
						// 当前长度不满页 且不是最后一页
						if ((this.activeList.length >= this.pageSize * pageNum) && (res.data.currPage !== res.data.totalPage)) {
							this.busy = false
						} else {
							// 加载完毕不再加载
							this.busy = true
						}
					}else {
						// 加载完毕不再加载
						this.busy = true
					}
				}
			})
		},
		//点赞
		likeit(id, index) {
			// 给请求加锁，避免重复点击请求
			if (this.likeit.sending) {
				return
			}
			this.likeit.sending = true
			// 判断调用哪个接口
			const isDelete = this.activeList[index].likeEver == '1'
			this.ajax({
				method: isDelete ? 'delete' : 'post',
				url: '/app/activities/'+id+'/activity-likes',
				success: res => {
					if (!isDelete && res.msg!=='已点赞该活动！') {
						this.activeList[index].likeCount++
						this.activeList[index].likeEver = '1'
					}
					if (isDelete && res.msg!=='无需取消点赞！') {
						this.activeList[index].likeCount--
						this.activeList[index].likeEver = '0'
					}
					this.$vux.toast.text(res.msg)
				},
				complete: res => {
					this.likeit.sending = false
				}
			})
		},
		// 查看活动所有留言评论
		tomessage(activityId) {
			this.$router.push({
				name: "allmessage",
				params: {
					activityId
				}
			})
		}
	},
	data() {
		return {
			busy: false,
			data: [], //loadMore
			index: 0,
			activityType: '',
			pageNum: 1,
			pageSize: 10,
			activeList: [],
			activityId: '',
			stautsList: [ '全部', '进行中','已结束' ],
			showmember: -1,
			activityName: '',
			userId: ''
		};
	}
};
</script>

<style lang="less" scoped>
	.card-List{
		.panel {
			margin-bottom: 1rem;
			padding: 1rem;
			background: #fff;
			.top {
				display: flex;
				justify-content: space-between;
				.top-left {
					display: flex;
					img {
						width: 3.17rem;
						height: 3.17rem;
						border-radius: 50%;
					}
					.partner{
						 margin: 0 1rem;
					}
				}
				span{
					width:6.33rem;
					height:2.68rem;
					background:rgba(248,195,1,1);
					border-radius:0.17rem;
					color:#fff;
					border-color:transparent;
					font-size: 1rem;
					line-height: 2.68rem;
					text-align: center;
				}
			}
			.h2 {
				font-size: 1.42rem;
				margin-top: 1.67rem;
			}
			.cover-img {
				width: 100%;
				height: 14rem;
			}
			.flex > div {
				padding: 0.5rem;
			}
			.flex > div > span {
				color: #c8c8c8;
			}
			.flex > div > span > span {
				color: #f8c301;
			}
			.rightinfo {
				display: flex;
				.likenum{
					margin-right: 2rem;
				}
				.likenum, .judgenum {
					display: flex;
					align-items: center;
					.cover-img {
						width:1.33rem;
						height:1.3rem;
						img {
							width: 100%;
						}
						margin-right: 3px;
					}
					span {
						color: #c8c8c8;
					}
				}
			}
			.likes {
				&.hidd {
					height: 2rem;
					overflow: hidden;
				}
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
				width: 100%;
				max-width: 100%;
				.joinitem {
					width: 2rem;
					height: auto;
					margin-right: 1rem;
					text-align: center;
					.joinlogo {
						width: 2rem;
						height: 2rem;
						border-radius: 50%;
						overflow: hidden;
						img {
							width: 100%;
						}
					}
					.user {
						font-size: 0.83rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(200, 200, 200, 1);
						line-height: 1.17rem;
					}
				}
			}
			.showmore {
				width: 2rem;
				height: 2rem;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.dot {
					width:0.3rem;
					height:0.3rem;
					color: #989898;
					border-radius: 50%;
					background:rgba(152,152,152,1);
				}
			}
		}
	}
</style>


