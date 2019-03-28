<template>
	<div class="allmessage">
		<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
			<div class="judges">
				<div class="judgement" v-for="(item, index) in allComment" :key="index"><!-- @click="tomessage" -->
					<div class="cover-img" :style="'background-image: url(' + item.headUrl + ')'"></div>
					<div class="right">
						<div class="name">{{item.userName}}</div>
						<div class="content"><span>{{item.comment}}</span><span></span></div>
						<div class="reply" v-for="reply in item.ratingReplyVoList">
							<span class="replyname">{{reply.userName}}：</span><span class="replycontent">{{reply.comment}}</span>
						</div>
						<form ref="form">
							<div class="answer" v-show="showInput==index?true:false">
								<span>{{localUserName}}：</span>
								<input type="text" v-model="form.answerContent[index]" id="inputreply" />
							</div>
						</form>
						<div class="time">
							<span>{{item.createTime}}</span>
							<span>
								<span class="cancel" @click="cancelInput(index)" v-show="showInput==index">取消</span>
								<label for="inputreply"><span @click="replyBack(item.id, index)">回复</span></label>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="nomsg" v-show="showmsg">该活动暂无评论留言...</div>
	</div>
</template>
<script>
import { Tab, TabItem } from "vux";
export default {
	name: "allmessage",
	components: { Tab, TabItem },
	created () {
		this.$store.commit("updateClickMore", { onClickMore: this.leaveMsg })
		// this.getAllComment()
	},
	beforeCreate() {
		this.$store.commit("updateTabbar", { tabbar: -1 });
		this.$store.commit("updateShowBack", { showBack: true });
    	this.$store.commit("updateShowMore", { showMore: '发布留言' });
		// this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
		this.$nextTick(() => {
			this.activityType = this.$route.params.activityType
			let activityId = this.$route.params.activityId
			this.activityId = activityId
			this.getUserInfo()
			this.getAllComment()
		})
	},
	data() {
		return {
			pageSize: 10,
			pageNum: 1,
			judgelogo: require("~assets/kiw/avatar.jpeg"),
			activityType: '',
			activityId: '',
			pid: '',
			allComment: [],
			replyList: [],
			showmsg: true,
			showInput: -1,
			localUserName: '',
			busy: false,
			form: { answerContent: [] }
		};
	},
	methods: {
		/**
		 * [loadMore 加载更多]
		 */
		loadMore: function() {
	      this.getAllComment()
	    },
		leaveMsg() {
			this.$router.push({
				name: 'addmsg',
				params: {
					activityId: this.activityId
				}
			})
		},
		// 获取所有评论
		getAllComment(pageNo) {
			const pageNum = pageNo || this.pageNum
			this.busy = true
			this.ajax ({
				method: 'get',
				url: '/app/activities/'+this.activityId+'/activity-ratings',
				data: {
					activityId: this.activityId,
					pageNum,
					pageSize: this.pageSize
				},
				success: res => {
					if (res.data) {
						this.pageNum = pageNum + 1
						this.allComment = this.allComment.concat(res.data.list || [])
						if (this.allComment) {
							this.showmsg = false
						}
						if (this.allComment.length >= this.pageSize * pageNum) {
							this.busy = false
						} else {
							this.busy = true
						}
					} else {
						this.busy = true
					}
				}
			})
		},
		//回复评论
		replyBack(id,index) {
			if (this.showInput !== index) {
				this.showInput = index
			} else {
				this.pid = id
				if (this.form.answerContent[index]) {
					this.ajax({
						method: 'post',
						url: '/app/user/add-activity-rating',
						data: {
							comment: this.form.answerContent[index],
							activityId: this.activityId,
							pid: this.pid,
							type: 2
						},
						success: res => {
							// console.log(res)
							if (res.code === 0) {
								this.$vux.toast.text("回复成功")
								this.showInput = -1
								this.form.answerContent[index] = ''
								this.getAllComment()
							}
						}
					})
				} else {
					this.$vux.toast.text("回复内容不能为空！")
				}
			}
		},
		//取消回复
		cancelInput(index) {
			this.showInput = -1
			this.form.answerContent[index] = ''
		},
		getUserInfo() {
			this.ajax({
				method: 'get',
				url: '/app/user',
				success: res => {
					// console.log(res)
					this.localUserName = res.data.userName
				}
			})
		}
	}
};
</script>

<style lang="less" scoped>
	.allmessage {
		overflow: hidden;
		.judges {
			margin-top: 1rem;
			width: 100%;
			background: #fff;
			.judgement {
				padding: 1rem;
				display: flex;
				border-bottom: 1px solid rgba(243,243,243,1);
				.cover-img {
					width:3.33rem;
					height:3.33rem;
					border-radius: 50%;
				}
				.right {
					margin-left: 1rem;
					width: 85%;
					.name {
						font-size:1.25rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(65,65,65,1);
						line-height:1.75rem;
					}
					.content {
						font-size:1rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(127,127,127,1);
						line-height:1.42rem;
					}
					.reply {
						line-height: 2.33rem;
						padding: 0 1rem;
						background:rgba(243,243,243,1);
						margin: 1rem 0;
						font-size:1rem;
						.replyname {
							color:rgba(0,0,0,1);
						}
						.replycontent {
							color: #7f7f7f;
							word-wrap: break-word;
						}
					}
					.answer {
						background: #eee;
						padding-left: 1rem;
						margin-top: 1rem;
						display: flex;
						input {
							background: #eee;
							border: none;
							margin-left: 1rem;
							width: 22.5rem;
						}
						input:focus {
							outline: none;
						}
					}
					.time {
						font-size:1rem;
						font-family:PingFang-SC-Medium;
						font-weight:500;
						color:rgba(220,220,220,1);
						line-height:1.17rem;
						margin-top: 1rem;
						display: flex;
						justify-content: space-between;
						.cancel {
							margin-right: 2rem;
						}
					}
				}
			}
		}
		.nomsg {
			font-size: 1.4rem;
			color: #ddd;
			text-align: center;
		}
	}
</style>