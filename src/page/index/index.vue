<template>
	<div class="base-div">
		<!-- <header v-show="!isHeader">
			<img src="~assets/kiw/logo@2x.png" alt="logo" class="logo">
			<span class="title">特旅+</span>
		</header> -->
		<swiper dots-position="center" >
			<swiper-item class="swiper-img" v-for="(item, index) in bannerList" :key="index" >
				<img :src="item.url" @click="toBannerUrl(item.jumpUrl)" />
			</swiper-item>
		</swiper>
		<flexbox class="tab">
			<flexbox-item v-for="(item, index) in tabList" :key="index">
				<div class="tab-li" @click="toAll(item.type)">
					<img :src="item.img">
					<p>{{item.text}}</p>
				</div>
			</flexbox-item>
		</flexbox>
		<div class="main-content">
			<h2>官方活动</h2>
			<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
				<div class="card-List">
					<div class="panel" v-for="(item, index) in activeList">
						<div @click="toDetail(item.type, item.id)">
							<div class="h2">{{item.title}}</div>
							<div class="cover-img" :style="'background-image: url(' + item.imgsPath + ')'"></div>
						</div>
						<div class="flex space-between">
							<div>
								<!-- <span>
									报名
									<span>{{item.joinCount}}</span>
								</span> -->
								<!-- <span class="support" >
									支持
									<span>{{item.supportCount}}</span>
								</span> -->
							</div>
							<div class="rightinfo">
								 <!-- :class="sending?'notclick':''" -->
								<div class="likenum" @click="likeit(item.id, index)">
									<div class="cover-img">
										<!-- {{item.likeEver}} -->
										<img v-show="item.likeEver=='0'||!item.likeEver" src="~assets/pisco/like.png" alt>
										<img v-show="item.likeEver=='1'" src="~assets/pisco/liked.png" alt>
									</div>
									<span>{{item.likeCount}}</span>
								</div>
								<div class="judgenum" @click="tomessage(item.type, item.id)">
									<div class="cover-img">
										<img src="~assets/pisco/judge.png" alt>
									</div>
									<span>{{item.replyCount}}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { Swiper, SwiperItem, Flexbox, FlexboxItem } from "vux";
import { mapState, mapActions } from "vuex";
export default {
	inject: [ 'reload' ],
	computed: mapState({
		route: state => state.route,
		path: state => state.route.path,
		tabbar: state => state.app.tabbar, // -1 不显示 0 1 2 3 对应项目active
		isHeader: state => state.app.isHeader // false 不显示 true 显示
	}),
	components: { Swiper, SwiperItem, Flexbox, FlexboxItem },
	beforeCreate() {
		this.$store.commit("updateTabbar", { tabbar: 0 });
		this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
		this.$nextTick( () => {
			this.getBanners();
			this.getOfficialAction();
		})
	},
	created() {
	    if (localStorage.getItem("userNow")) {
		   	localStorage.removeItem("userNow")
		   	// this.$store.commit("updateUser", { userNow: '' });
	    }
	},
	methods: {
		/**
		 * [loadMore 加载更多]
		 */
		loadMore: function() {
	      this.getOfficialAction()
	    },
	    //获取banner图
	    getBanners() {
	    	this.ajax({
	    		method: "get",
	    		url: "/app/banners",
	    		data: {},
	    		success: res => {
	    			this.bannerList = res.data;
	    		}
	    	});
	    },
		//获取官方活动列表
		getOfficialAction(pageNo) {
			const pageNum = pageNo || this.pageNum
			this.busy = true
			this.ajax({
				method: "get",
				url: "/app/activities",
				data: {
					// activityType: this.activityType, // 活动类别: 1-官方活动 2-户外活动 3-产品消费 4-爱心公益 5-宴会活动 6-众筹活动
					pageNum,
					pageSize: this.pageSize,
					indexStatus: 1, // 首页展示: 0-否 1-是
					activityStatus: null // 活动状态: 1-进行中（筹款中） 2-已完成 null-全部
				},
				success: res => {
					console.log(res)
					if (res.data) {
						this.pageNum = pageNum + 1
						this.activeList = this.activeList.concat(res.data.list || [])
						if (this.activeList.length >= this.pageSize * pageNum) {
							this.busy = false
						} else {
							this.busy = true
						}
					} else {
						this.busy = true
					}
				}
			});
		},
		//根据活动类型前往相应所有活动页面
		toAll(activityType) {
			this.$router.push({
				name: "activity",
				params: {
					activityType
				}
			});
		},
		//点击官方活动前往活动详情
		toDetail(activityType, activityId) {
			this.$router.push({
				name: "activitydetail",
				params: {
					activityType,
					activityId
				}
			});
		},
		//点赞
		likeit(id, index) {
			if (this.likeit.sending) {
				return
			}
			this.likeit.sending = true
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
		// 前往所有评论列表
		tomessage(activityType, activityId) {
			this.$router.push({
				name: "allmessage",
				params: {
					activityType,
					activityId
				}
			})
		},
		//banner图链接
		toBannerUrl(jump) {
			if(jump) {
				window.location.href = jump
			}
		}
	},
	data() {
		return {
			activityType: 1,
			activityId: "",
			typeNum: "",
			pageNum: 1,
			pageSize: 10,
			bannerIndex: 0, // 轮播下标
			data: [], // 加载更多
		    busy: false, // 加载中
			bannerList: [],
			tabList: [
				{
					// 活动类型
					icon: "icon-liwu",
					img: require("~assets/kiw/icon_index_mountain_normal@2x.png"),
					text: "特种旅游",
					type: 2
				},
				{
					icon: "icon-liwu",
					img: require("~assets/kiw/icon_index_mountain_normal1@2x.png"),
					text: "众筹赛事",
					type: 3
				},
				{
					icon: "icon-liwu",
					img: require("~assets/kiw/icon_index_mountain_normal2@2x.png"),
					text: "自驾旅行",
					type: 4
				},
				{
					icon: "icon-liwu",
					img: require("~assets/kiw/icon_index_mountain_normal3@2x.png"),
					text: "品牌合作",
					type: 5
				},
				{
					icon: "icon-liwu",
					img: require("~assets/kiw/icon_index_mountain_normal4@2x.png"),
					text: "众筹列表",
					type: 6
				}
			],
			activeList: []
		};
	}
};
</script>
<i18n>
</i18n>
<style lang="less" scoped>
a {
	color: #000;
}
.base-div {
	background-color: #f5f5f5;
	header {
		padding-left: 3.5rem;
		height: 3.67rem;
		// margin-bottom: 0.67rem;
		background-color: #f8c301;
		.logo {
			display: inline-block;
			vertical-align: middle;
			height: 3.67rem;
			background-color: #ddd;
			margin-right: 1.86rem;
		}
		.title {
			vertical-align: middle;
			width: 4.08rem;
			height: 2rem;
			font-size: 1.42rem;
			font-family: PingFang-SC-Bold;
			font-weight: bold;
			color: rgba(0, 0, 0, 1);
			line-height: 2rem;
			letter-spacing: 1px;
		}
	}
	.tab {
		margin-top: 1rem;
		margin-bottom: 1rem;
		padding-top: 0.67rem;
		padding-bottom: 0.58rem;
		background-color: #fff;
		.tab-li {
			text-align: center;
			img {
				width: 3.17rem;
				height: 3.17rem;
			}
		}
		p {
			// height:1.17rem;
			margin-top: 0.33rem;
			font-size: 0.83rem;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(65, 65, 65, 1);
			line-height: 1.17rem;
		}
		i {
			display: inline-block;
			text-align: center;
			font-size: 1.6rem;
			border-radius: 50%;
			color: #fff;
			width: 3.17rem;
			line-height: 3.17rem;
			&.color1 {
				background: linear-gradient(
					108deg,
					rgba(250, 217, 97, 1) 0%,
					rgba(247, 107, 28, 1) 100%
				);
			}
			&.color2 {
				background: linear-gradient(
					300deg,
					rgba(101, 90, 205, 1) 0%,
					rgba(200, 109, 215, 1) 100%
				);
			}
			&.color3 {
				background: linear-gradient(
					113deg,
					rgba(241, 146, 155, 1) 0%,
					rgba(250, 27, 61, 1) 100%
				);
			}
			&.color4 {
				background: linear-gradient(
					115deg,
					rgba(124, 222, 230, 1) 0%,
					rgba(46, 148, 178, 1) 100%
				);
			}
			&.color5 {
				background: linear-gradient(
					126deg,
					rgba(180, 236, 81, 1) 0%,
					rgba(66, 147, 33, 1) 100%
				);
			}
		}
	}
	.main-content {
		min-height:20rem;
		h2 {
			padding: 0.7rem 1rem;
			font-size: 1.42rem;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(65, 65, 65, 1);
			line-height: 1.42rem;
		}
		.card-List {
			.panel {
				margin-bottom: 1rem;
				padding: 1rem;
				background: #fff;
			}
			.h2 {
				font-size: 1.42rem;
			}
			.cover-img {
				width: 100%;
				height: 14rem;
			}
			.support {
				margin-left: 2rem;
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
				.likenum {
					margin-right: 2rem;
					&.notclick {
						pointer-events: none;
					}
				}
				.likenum,
				.judgenum {
					display: flex;
					align-items: center;
					.cover-img {
						width: 1.33rem;
						height: 1.33rem;
						img {
							width: 1.33rem;
							height: 1.33rem
						}
						margin-right: 3px;
					}
					span {
						color: #c8c8c8;
					}
				}
			}
		}
	}
	/deep/ .vux-slider .vux-indicator-center {
		bottom: 1rem;
		a {
			margin-left: 0.5rem;
		}
		i {
			width: 0.67rem;
			height: 0.67rem;
			border-radius: 50%;
			background-color: #fff;
			&.vux-icon-dot.active {
				background: rgba(31, 31, 31, 1);
			}
		}
	}
	.swiper-img img {
		width: 100%;
		height: 100%;
	}
	/deep/ .vux-slider > .vux-swiper {
		height: 18.83rem!important;
	}
}
</style>
