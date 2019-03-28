<template>
	<div>
		<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
			<div class="card-List">
				<div class="panel" v-for="(item, index) in activeList" :key="index"  @click="toDetail(item.id, item.type)">
					<div>
						<div class="top">
							<div class="top-left">
								<img :src="item.userHeadUrl" alt>
								<div class="partner">
									<p>{{item.userName}}</p>
									<p>{{item.createTime}}</p>
								</div>
							</div>
							<span v-if="type == 1">立即查看</span>
							<span v-if="type == 2">立即编辑</span>
						</div>
						<p class="h2">{{item.title}}</p>
						<div  class="cover-img"  :style="'background-image: url('+(item.imgsPath || require('~assets/kiw/ph@2x.png'))+')'"></div>
						<!-- <img v-if="item.imgsPath" class="cover-img" :src="item.imgsPath" alt>
						<img v-else class="cover-img" src="~assets/kiw/ph@2x.png" alt> -->
					</div>
					<div class="flex space-between">
						<div>
							<!-- <span>
								已报名
								<span>{{item.joinCount}}</span>
							</span> -->
						</div>
						<div class="rightinfo">
							<div class="likenum">
								<div class="cover-img">
									<img src="~assets/pisco/like.png" alt>
								</div>
								<span>{{item.likeCount}}</span>
							</div>
							<div class="judgenum">
								<div class="cover-img">
									<img src="~assets/pisco/judge.png" alt>
								</div>
								<span>{{item.replyCount}}</span>
							</div>
						</div>
					</div>
					<div class="process">
						<p :style="{'width':item.supportParcent+'%'}"></p>
						<span></span>
					</div>
					<p class="parcent">{{item.supportParcent}}%</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Tab, TabItem, XProgress, Box } from "vux";
export default {
	name: "MyActivitys",
	components: {
		Tab,
		TabItem,
		XProgress,
		Box
	},
	beforeCreate() {
		this.$store.commit("updateTabbar", {
			tabbar: -1
		});
		this.$store.commit("updateShowBack", {
			showBack: true
		});
		// this.$store.commit("updateShowMore", {
		//   showMore: "添加活动"
		// });
		// this.$nextTick(() => {
		// 	this.type = this.$route.params.type;
		// })
	},
	created() {
		this.type = this.$route.params && this.$route.params.type;
		if(!this.type){
			this.type = localStorage.getItem('MyActivityType')
		}
		if(this.type == 2){
			this.$store.commit("updatePageTitle", { pageTitle:  document.title = '发起活动'})
		}
		this.$store.commit("updateClickMore", {
			onClickMore: this.addActivity
		});
		this.url = this.type == 1 ? "/app/user/my-activities" : "/app/user/activities";
		this.getMyActivity()
	},
	methods: {
		/**
		 * [loadMore 加载更多]
		 */
		loadMore: function() {
			this.getMyActivity()
		},
		addActivity() {
			this.$router.push({
				name: "sponsor"
			});
		},
		toDetail(activityId, activityType){
			var Name = this.type == 1?"activitydetail":"updateActivity";
			this.$router.push({
				name:Name,
				params:{
					activityId,
					activityType
				}
			})
		},
		getMyActivity(pageNo) {
			const pageNum = pageNo || this.pageNum
			this.busy = true
			this.ajax({
				method: "get",
				url: this.url,
				data: {
					pageNum,
					pageSize: this.pageSize
				},
				success: res => {
					console.log(res)
					if (res.data) {
						this.pageNum = pageNum + 1
						for(var i= 0; i<res.data.list.length;i++){
							res.data.list[i].supportParcent =(res.data.list[i].actualSupportAmount/res.data.list[i].supportAmount*100).toFixed(2);
						}
						this.activeList = this.activeList.concat(res.data.list || [])
						if (this.activeL.length >= this.pageSize * pageNum) {
							this.busy = false
						} else {
							this.busy = true
						}
					} else {
						this.busy = true
					}
				}
			});
		}
	},
	destroyed(){
		localStorage.setItem('MyActivityType',this.type)
	},
	data() {
		return {
			url: '',
			busy: false,
			data: [],
			value: "",
			activityType: "",
			pageNum: 1,
			pageSize: 10,
			activeList: [],
			joinList: [],
			activityId: ""
		};
	}
};
</script>

<style lang="less" scoped>
.card-List {
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
				.partner {
					margin: 0 1rem;
					p:last-child {
						color: rgba(200, 200, 200, 1);
					}
				}
			}
			span {
				width: 6.33rem;
				height: 2.68rem;
				background: rgba(248, 195, 1, 1);
				border-radius: 0.17rem;
				color: #fff;
				border-color: transparent;
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
			.likenum {
				margin-right: 2rem;
			}
			.likenum,
			.judgenum {
				display: flex;
				align-items: center;
				.cover-img {
					width: 1.33rem;
					height: 1.21rem;
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
			display: flex;
			.likelogo {
				width: 2rem;
				height: 2rem;
				border-radius: 50%;
				margin-left: 1rem;
				overflow: hidden;
				img {
					width: 100%;
				}
			}
			.showmore {
				width: 2rem;
				height: 2rem;
				display: flex;
				justify-content: space-around;
				align-items: center;
				margin-left: 1rem;
				.dot {
					width: 0.3rem;
					height: 0.3rem;
					color: #989898;
					border-radius: 50%;
					background: rgba(152, 152, 152, 1);
				}
			}
			.likelogo:first-child {
				margin-left: 0;
			}
		}
	}
}
.process {
	width: 100%;
	height: 0.5rem;
	background: rgba(238, 238, 238, 1);
	border-radius: 0.5rem;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	p {
		height: 0.5rem;
		background: rgba(248, 195, 1, 1)!important;
		border-radius: 0.5rem;
	}
	span {
		width: 1.17rem;
		height: 1.17rem;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0rem 0.08rem 0.25rem 0rem rgba(0, 0, 0, 0.23);
		border-radius: 50%;
	}
}
.parcent{
		color:rgba(200,200,200,1);
		font-size:0.83rem;
		line-height:1.17rem;
		// float: right;
		margin-top:.5rem;
		position: relative;
		left:100%;
		transform: translate(-100%);
		width:max-content;
}
</style>


