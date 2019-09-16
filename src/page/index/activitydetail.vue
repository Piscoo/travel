<template>
	<div class="activitydetail" ref="backTop">
		<div class="cover-img" :style="'background-image: url('+detailInfo.imgsPath+')'">
			<div class="dec" v-if="detailInfo.type == 6">
				<div class="user" style="width: 100%">
					<div class="profil" :style="'background-image: url('+detailInfo.userVo.headUrl+')'"></div>
					<div class="name">{{detailInfo.userVo.userName}}</div>
					<div class="teamName">{{detailInfo.teamName}}战队</div>
				</div>
				<div class="words">{{detailInfo.userVo.signature}}</div>
			</div>
			<div class="water" v-show="showWater"><img src="~assets/pisco/water.png" alt=""></div>
		</div>
		<div class="supportdecl" v-if="detailInfo.type == 6">
			<div class="words"><span>战队宣言：</span>{{detailInfo.supportDecl}}</div>
		</div>
		<div class="actionInfo">
			<div class="actionName">{{detailInfo.title}}</div>
			<div class="actionTime">{{detailInfo.startTime}}~{{detailInfo.endTime}}</div>
			<!-- 活动剩余时间  已完成的活动不显示   detailInfo.status===2 为已完成的活动 -->
			<div class="leftTime" v-show="detailInfo.status == 1" v-if="detailInfo.type == 6">
				剩余<span class="dayNum">{{detailInfo.remainDateNum}}</span>天
			</div>
		</div>
		<div class="actionFee">
			<div class="joinFee grow">
				<div class="topnum">￥{{detailInfo.supportAmount||0 }}</div>
				<div class="bottomname">报名费用</div>
			</div>
			<div class="line"></div>
			<div class="needFee grow" v-if="detailInfo.type == 6">
				<div class="topnum">￥{{detailInfo.noFinishSupportAmount||0 }}</div>
				<div class="bottomname">未完成金额</div>
			</div>
			<div class="line" v-if="detailInfo.type == 6"></div>
			<div class="supportNum grow">
				<div class="topnum">{{(detailInfo.type == 6 ? detailInfo.supportCount : detailInfo.registerCount) ||0}}人</div>
				<div class="bottomname">{{detailInfo.type == 6 ? "支持人数" : "参与人数"}}</div>
			</div>
		</div>
		<div class="progress" v-if="detailInfo.type == 6">
			<div class="name">金额进度</div>
			<div class="processbg">
				<div class="process">
					<p :style="{'width':numNow+'%'}"></p >
					<span></span>
				</div>
				<div class="moneynow">已完成：{{numNow}}%</div>
			</div>
		</div>
		<div class="join" v-if="detailInfo.type == 6">
			<div class="name">团队报名情况</div>
			<div style="display:flex;background:#fff;align-items:center;" v-show="supportPeople.length>=1">
				<div class="joins" :class="showmember?'':'hidd'">
					<div v-for="item in supportPeople" class="joinitem">
						<div class="joinlogo">
							<img :src="item.headUrl" @click="toHisAct(item.activityId)" alt>
						</div>
						<!-- <div class="user">{{item.userName}}</div> -->
					</div>
					<div class="hiddmore" @click="hiddmore" v-show="showmember">收起</div>
				</div>
				<div class="showmore" v-if="supportPeople.length >= 7" v-show="!showmember" @click="showmen"><!--  -->
					<div class="dot" v-for="item in 3"></div>
				</div>
			</div>
		</div>
		<!-- <div class="actiontab" v-show="detailInfo.status == 1"> -->
		<div class="actiontab"> <!-- 详情始终存在 -->
			<tab :line-width="2" active-color="#F8C301" v-model="index" :custom-bar-width="getBarWidth">
				<tab-item class="vux-center" v-for="(item, index) in actionList" :key="index">{{item}}</tab-item>
			</tab>
			<!-- 活动详情 -->
			<div class="actiondetail" ref="elActiondetail" v-show="index=== 0" :class="showActiondetail ? 'auto' : ''">
				<div class="dec" v-html="detailInfo.details"></div>
				<div class="showmore" v-show="actiondetailBtn" @click="showActiondetail = !showActiondetail"><div style="margin:0 1rem;background:rgba(0,0,0,0.36);font-size: 1.5rem;font-weight: bold;">{{showActiondetail ? '收起' : '点击查看更多'}}</div></div>
			</div>
			<!-- 报名须知 -->
			<div class="joinnotice" ref="elJoinnotice" v-show="index===1" :class="showJoinNotice ? 'auto' : ''">
				<div class="dec" v-html="detailInfo.joinNotice"></div>
				<div class="showmore" v-show="joinnoticeBtn" @click="showJoinNotice = !showJoinNotice"><div style="margin:0 1rem;background:rgba(0,0,0,0.36);font-size: 1.5rem;font-weight: bold;">{{showJoinNotice ? '收起' : '点击查看更多'}}</div></div>
			</div>
			<!-- 发起人介绍 -->
			<div class="group" v-show="index===2" ref="elIntroduction" :class="showIntroduction ? 'auto' : ''">
				<!-- <div class="dec" v-html="detailInfo.joinNotice"></div> -->
				<div class="dec" v-html="detailInfo.introduction"></div>
				<div class="showmore" v-show="introBtn" @click="showIntroduction = !showIntroduction"><div style="margin:0 1rem;background:rgba(0,0,0,0.36);font-size: 1.5rem;font-weight: bold;">{{showIntroduction ? '收起' : '点击查看更多'}}</div></div>
			</div>
			<!-- 即时感言以及评论列表暂时隐藏 -->
		</div>
		<div class="feeling" @click="toWrite">
			<div class="feelnow">即时感言</div>
			<div class="cover-img" :style="'background-image: url(' + writeimg + ')'"></div>
		</div>
		<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
			<div class="judges">
				<div class="judgement" v-for="(item, index) in judgeList" :key="index" v-if="filitjudge(item.userNo, item.supportAmount)">
					<div class="cover-img" :style="'background-image: url(' + item.headUrl + ')'"></div>
					<div class="right">
						<div class="name">{{item.userName}} <span class="eva-right" v-show="item.supportAmount">支持：{{item.supportAmount}}元</span></div>
						<div class="content">{{item.comment}}</div>
						<div class="reply" v-for="reply in item.ratingReplyVoList">
							<span class="replyname">{{reply.userName}}：</span><span class="replycontent">{{reply.comment}}</span>
						</div>
						<form ref="formMsg">
							<div class="answer" v-show="showInput==index?true:false">
								<span>{{localUserName}}：</span>
								<input type="text" v-model="formMsg.answerContent[index]" id="inputreply" />
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
		<div class="rightitem">
			<div class="rightimg2" @click="toTotalRank">
				<img src="~assets/pisco/range.png" alt>
				<div class="name">总榜</div>
			</div>
			<div class="rightimg" v-if="detailInfo.type == 6" @click="team">
				<img src="~assets/pisco/team1.png" alt>
				<div class="name">团队榜</div>
			</div>
			<!-- 返回顶部，暂时隐藏 -->
			<!-- <div class="rightimg2">
				<img src="~assets/pisco/totop.png" alt @click="backTop" >
			</div> -->
		</div>
		<!-- 支持好友弹窗部分 -->
		<div v-transfer-dom>
			<x-dialog v-model="showSupport" class="dialog-demo" hide-on-blur style="overflow: auto;">
				<div class="cover-img" :style="'background-image: url(' + localUserHead + ')'"></div>
				<div @click="showSupport=false">
					<span class="vux-close"></span>
				</div>
				<form ref="form">
					<div class="money">
						<div class="moneylist">
							<div v-for="(item, index) in supportType" class="moneyitem" :class="form.moneyF === item.amount ? 'active' : ''" @click="form.moneyF = item.amount,form.entermoney = ''">
								<span v-if="item">{{item.amount}}元</span>
							</div>
							<div class="enter"  :class="form.moneyF === form.entermoney ? 'active' : ''" @click="form.moneyF = form.entermoney">
								<input type="number" placeholder="自定义"  v-model="form.entermoney" />
							</div>
						</div>
					</div>
					<div class="form">
						<group>
							<x-textarea placeholder="留言：想说些点什么" name="mesa" v-model="form.mesa" required></x-textarea>
						</group>
					</div>
					<div class="pay" @click="toPay">确定支付</div>
				</form>
			</x-dialog>
		</div>
		<!-- 参加报名弹窗部分 已废弃 -->
		<div v-transfer-dom>
			<x-dialog v-model="showJoinIn" class="dialog-demo" hide-on-blur style="overflow: auto;">
				<div @click="showJoinIn=false">
					<span class="vux-close"></span>
				</div>
				<form ref="form">
					<div class="money">
						<group title="战队名称" v-if="detailInfo.type!=6">
				      <x-input title="" text-align="center" v-model="form.teamName" placeholder="请输入战队名称" required></x-input>
				    </group>
					</div>
					<div class="pay" @click="toJoin">报名参加</div>
				</form>
			</x-dialog>
		</div>
		<!-- 分享到朋友圈弹层 -->
		<div v-transfer-dom>
			<div v-show="showShare" class="sharebox" @click.stop="hideShare" @touchmove.prevent>
				<div class="arrow"><img src="~assets/pisco/up.png" alt=""></div>
				<div>点击<span class="timeline">"分享到朋友圈"</span></div>
				<div class="rightnow"><span class="line"></span>马上开始众筹!<span class="line"></span></div>
				<!-- <x-button @click="location.href='https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=gh_f38f67a310fb==&amp;scene=110#wechat_redirect">关注</x-button> -->
			</div>
		</div>
		<!-- 未关注公众号弹层 -->
		<div v-transfer-dom>
			<x-dialog v-model="showFollow" class="dialog-demo" hide-on-blur style="overflow: auto;">
				<div @click="showFollow=false">
					<span class="vux-close"></span>
				</div>
				<div class="money">
					<div class="em">
						系统检测到您还没关注我门公众号，为了提供更好的服务，让您能及时收到众筹进度的消息，建议您先关注我们公众号。
					</div>
				</div>
				<div class="btn default pay" @click="joinIn(true)">继续报名</div>
				<a class="btn pay" href="http://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=Mzg4MTAxMTU2Nw==&scene=110#wechat_redirect">前往关注</a>
			</x-dialog>
		</div>
		<!-- 已退款的活动加透明遮罩层，不让滑动和点击 -->
		<div v-transfer-dom>
			<div class="shadow" v-show="showShadow" @touchmove.prevent></div>
		</div>
		<!-- 底部栏 -->
		<div v-transfer-dom>
			<div  class="bottom" v-show="detailInfo.type == 6">
				<template v-if="detailInfo.isRepresent == 1">
					<div class="getin" @click="toPhone" style="width:100%; ">成为合伙人</div>
					<!-- <div class="friend">发起众筹</div> -->
				</template>
				<!-- <div  v-else class="finished">众筹已完成</div -->
				<template v-else>
					<div v-if="detailInfo.isOrganiger == 0" style="display:flex;width:100%;">
						<div class="getin" @click="joinIn">我要报名</div>
						<div class="friend" :class="detailInfo.status == 2 ? 'finished' : ''" @click="SupportFriend" >支持好友</div>
						 <!-- <x-button @click.native="followTest">关注</x-button> -->
					</div>
					<div v-if="detailInfo.isOrganiger == 1" style="display:flex;width:100%;">
						<div class="getin" @click="SupportFriend" :class="detailInfo.status == 2 ? 'finished' : ''">本人付款</div>
						<div class="friend" @click="toShare">分享给好友</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>
<script>
	import { XTextarea, XInput, Group, XProgress, Box, Tab, TabItem, Swiper, SwiperItem, XButton, XDialog,TransferDomDirective as TransferDom } from "vux";
	export default {
		name: "activitydetail",
		inject: [ 'reload' ],
		components: { XTextarea, XInput, Group, XProgress, Box, Tab, TabItem, Swiper, SwiperItem, XDialog, XButton },
		directives: {TransferDom},
		watch: {
			index () {
				this.$nextTick ( () => {
					let elActiondetail = this.$refs.elActiondetail
					let elJoinnotice = this.$refs.elJoinnotice
					let elIntroduction = this.$refs.elIntroduction
					this.actiondetailBtn = elActiondetail.offsetHeight < elActiondetail.scrollHeight
					this.joinnoticeBtn = elJoinnotice.offsetHeight < elJoinnotice.scrollHeight
					this.introBtn = elIntroduction.offsetHeight < elIntroduction.scrollHeight
				})
			},
			'$route.params.activityId': function (value) {
				if (value != this.activityId) {
					this.activityId = value
					//清空评论数组
					this.judgeList = []
					this.pageNum = 1
					this.getActivityDetail();
					this.getJudge();
					this.getsupport();
				}
			}
		},
		methods: {
			/**
			 * laodMore   加载更多
			*/
			loadMore: function() {
				// this.getJudge()
			},
			/**
			 * [filitjudge 留言过滤活动发起者支持自己]
			 * @param  {[string]} useruserVo [用户id]
			 * @param  {[string]} supportAmount [支持金额]
			 * @return {[boolean]}           [是否显示]
			*/
			filitjudge (userNo, supportAmount) {
				const publishUserVo = this.detailInfo.userVo
				return supportAmount ? publishUserVo.userNo ? publishUserVo.userNo !== userNo : true : true
			},
			//成员头像展开
			showmen() {
				this.showmember = true
			},
			//成员头像收起
			hiddmore() {
				this.showmember = false
			},
			// 前往所有评论列表
			// tomessage () {
			// 	this.$router.push({
			// 		name: "allmessage",
			// 		params: {
			// 			activityId: this.activityId
			// 		}
			// 	});
			// },
			// 取消发起活动
			cancel () {
				this.$vux.confirm.show({
					closeOnConfirm: false,
					hideOnBlur: true,
					title: '取消发起',
					content: '确定要取消发起活动吗？',
				  // 组件除show外的属性
				  onCancel () {
				    // console.log(this) // 非当前 vm
				  },
				  onConfirm: res => {
				  	this.ajax({
				  		method: "post",
				  		url: `/app/activities/${this.activityId}/cancel`,
				  		success: res => {
				  			this.$vux.confirm.hide()
				  			this.$vux.toast.text('取消成功')
				  			this.$router.back(-1)
				  		}
				  	})
				  }
				})
			},
			// 新增评论
			toWrite() {
				this.$router.push({
					name: "addmsg",
					params: {
						activityId: this.activityId
					}
				});
			},
			// 获取活动详情
			getActivityDetail() {
				this.ajax({
					method: "get",
					url: "/app/activities/" + this.activityId,
					data: { activityId: this.activityId },
					success: res => {
						if (res.data.status == -2 || res.data.status == -4) {
							this.showShadow = true
							this.$vux.toast.text("活动筹款失败")
							setTimeout(this.backToIndex, 3000)
							this.showWater = false
						} else if (res.data.status == 2) {
							//众筹成功才显示水印
							this.showWater = true
						} else {
							this.showWater = false
						}
						this.$store.commit("updateShowTitleImg", { showTitleImg:  true})
						let detailInfo =  res.data
						const title = detailInfo.teamName ? detailInfo.teamName + '战队活动' : '官方活动'
						document.title = title
						// const newtitle = this.activityType == 6 ? `${detailInfo.supportCountTotal || 0}人支持 ${detailInfo.followCountTotal || 0}人关注` : `${detailInfo.supportCount || 0}人支持  ${detailInfo.followCount || 0}人关注`
						const newtitle = this.activityType == 6 ? [`${detailInfo.supportCountTotal || 0}人支持`,  `${detailInfo.followCountTotal || 0}人关注`] : [`${detailInfo.supportCount || 0}人支持 `, `${detailInfo.followCount || 0}人关注`]
						this.$store.commit('updatePageTitle', { pageTitle: newtitle })
						detailInfo.userVo = detailInfo.userVo || {}
						this.detailInfo = detailInfo
						this.detailInfo.detailsImgPath = JSON.parse(res.data.detailsImgPath) && JSON.parse(res.data.detailsImgPath)[0]
						this.supportAmount = this.detailInfo.supportAmount
						// 计算已完成的进度， 保留小数点后两位
						this.numNow = ((this.detailInfo.actualSupportAmount / this.detailInfo.supportAmount ) * 100 || 0).toFixed(2).replace(/^0.00/, 0)
						if (detailInfo.userVo.userName) {
							this.$store.commit("updateUser", { userNow: detailInfo.userVo.userName });
						}
						const teamName = detailInfo.teamName?`【${detailInfo.teamName}】` : ''
						this.teamName = teamName

						// 分享配置
						this.share({
						    title : `${teamName} ${detailInfo.title}`,
						    link : 'http://' + location.host + '/fundrais/index.html?' + location.hash,
						    imgUrl : detailInfo.imgsPath || ('http://' + location.host + '/fundrais/static/img/logo@2x.0659ca3.png'),
						    desc: detailInfo.userVo.userName ? `${detailInfo.userVo.userName}报名参加了${detailInfo.title}` : detailInfo.supportDecl
						})
						this.$nextTick ( () => {
							setTimeout(() => {
								let elActiondetail = this.$refs.elActiondetail
								// let elJoinnotice = this.$refs.elJoinnotice
								// let elIntroduction = this.$refs.elIntroduction
								this.actiondetailBtn = elActiondetail.offsetHeight < elActiondetail.scrollHeight
								// this.joinnoticeBtn = elJoinnotice.offsetHeight < elJoinnotice.scrollHeight
								// this.introBtn = elIntroduction.offsetHeight < elIntroduction.scrollHeight
							}, 300)
						})
					}
				});
			},
			// 获取支持人列表
			getsupport() {
				this.ajax({
					method: "get",
					url: "/app/activities/"+ this.activityId+"/activity-support",
					data: {
						activityId: this.activityId,
						pageNum: this.pageNum,
						pageSize: this.pageSize
					},
					success: res => {
						this.supportPeople = res.data.list || []
					}
				});
			},
			// 获取评论
			getJudge(pageNo) {
				const pageNum = pageNo || this.pageNum
				this.busy = true
				this.ajax({
					method: "get",
					url: "/app/activities/" + this.activityId + "/activity-ratings",
					data: {
						activityId: this.activityId,
						pageNum,
						pageSize: this.pageSize
					},
					success: res => {
						if (res.data) {
							res.data.list.forEach( item => {
								//支持金额显示小数点后两位
								if (item.supportAmount) {
									item.supportAmount = item.supportAmount.toFixed(2)
								}
							})
							this.judgeList = res.data.list|| []
							if (pageNum > res.data.totalPage) {
								this.busy = true
							} else {
								this.busy = false
								this.pageNum = this.pageNum + 1
							}
						} else {
							this.busy = true
						}
					}
				});
			},
			//回复评论
			replyBack(id,index) {
				if (this.showInput !== index) {
					this.showInput = index
				} else {
					this.pid = id
					if (this.formMsg.answerContent[index]) {
						this.ajax({
							method: 'post',
							url: '/app/user/add-activity-rating',
							data: {
								comment: this.formMsg.answerContent[index],
								activityId: this.activityId,
								pid: this.pid,
								type: 2
							},
							success: res => {
								if (res.code === 0) {
									this.$vux.toast.text("回复成功")
									this.showInput = -1
									this.formMsg.answerContent[index] = ''
									this.getJudge(1)
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
				this.formMsg.answerContent[index] = ''
			},
			// 前往团队榜
			team() {
				this.$router.push({
					name: "teaminfo",
					params: {
						activityId: this.activityId
					}
				})
			},
			// 前往总榜 
			toTotalRank() {
				const activityId = this.activityType == 6 ? this.detailInfo.originalActivityId : this.activityId
				this.$router.push({
					name: "totalrange",
					params: {
						activityId
					}
				})
			},

			getUserInfo() {
				this.ajax({
					method: 'get',
					url: '/app/user',
					success: res => {
						this.localUserHead = res.data.headUrl
						this.localUserName = res.data.userName
					}
				})
			},
			// 我要报名
			joinIn (next) {
				if (this.isfollowed || next === true) {
					this.ajax({
						method: 'post',
						url: '/app/user/activities/'+ this.activityId,
						data: {activityId: this.activityId},
						success: res => {
							this.showJoinIn = false
							this.showFollow = false
							this.$vux.toast.text('报名成功！')
							this.$router.push({
								params: {
									'activityId': res.data.activityId
								}
							})
						},
						fail: res => {
							if (res.code === 500) {
								// 资料未填写
							} else if (res.code === 521) {
								this.showJoinIn = false
								this.showFollow = false
								this.$router.push({
									name: 'update',
									params: {
										updateType: 1,
										activityId: this.activityId
									}
								})
							}
						}
					})
				} else {
					this.showFollow = true
				}
			},
			// 获取支持方式
			SupportFriend(){
				this.ajax({
					method: 'get',
					url: '/app/activities/'+ this.activityId+'/pay-amounts',
					data: {},
					success: res => {
						this.supportType=res.data
						this.showSupport = true;
					}
				});
			},
			// 支持好友付费
			toPay() {
				if (this.form.entermoney) {
				  this.form.moneyF = this.form.entermoney
				}
				if (this.form.moneyF) {
					this.ajax({
						method: 'post',
						url: '/app/activities/'+ this.activityId+'/activity-support/wechat-pre-pay'+'?comment=' + this.form.mesa,
						data: {
							activityId:  this.activityId,
							amount: this.form.moneyF
						},
						headers:{
							'Content-Type':  'application/x-www-form-urlencoded;charset=UTF-8'
						},
						success: res => {
							this.showSupport = false
							this.$callWxPay(res.data, res => {
								if (res === true) {
									//支付成功
									this.showSupport = false
									this.$vux.toast.show({
										type: 'text',
										text: `感恩您的支持 ，我一定全力以赴完成${this.detailInfo.title}！也邀请您一同并肩而行。`,
										time: 3000,
										width: "20rem"
									})
									setTimeout(() => {
										this.reload()
									}, 3000)
								} else {
									//支付失败
									// this.$vux.toast.text(res.msg)
								}
							})
						},fail: res => {
							if (res.code === 521) {
								this.showSupport = false
								return this.$router.push({
									name: 'update'
								})
							}
						}
					});
				} else {
					this.$vux.toast.text("请选择金额")
				}
			},
			toJoin() {
				if (this.form.activityDay) {
					var formData = new FormData()
					if (!this.form.teamName && (this.detailInfo.type != 6)) {
						return this.$vux.toast.text('未填写战队名!')
					}
					if (!this.form.activityDay) {
						return this.$vux.toast.text('未选择活动天数！')
					}
					formData.append("days", this.form.activityDay)
					formData.append("activityId", this.activityId)
					formData.append("teamName", this.form.teamName)
					this.ajax({
						method: 'post',
						url: '/app/user/activities/'+ this.activityId,
						data: formData,
						success: res => {
							this.showJoinIn = false
							this.$vux.toast.text('报名成功！')
							this.$router.push({
								params: {
									'activityId': res.data.activityId
								}
							})
						},
						fail: res => {
							if (res.code === 500) {
								// 资料未填写
							} else if (res.code === 521) {
								this.showJoinIn = false
								this.$router.push({
									name: 'update'
								})
							}
						}
					})
				} else {
					this.$vux.toast.text("请选择活动时间")
				}
			},
			toPhone () {
				this.$router.push({
					name: "phone",
					params: {
						activityId: this.activityId
					}
				})
			},
			//分享活动
			toShare() {
				this.showShare = true
			},
			hideShare() {
				this.showShare = false
			},
			//点击头像前往对应用户的活动
			toHisAct(id) {
				this.$router.push({
					params: {
						activityId: id
					}
				})
			},
			//返回首页
			backToIndex() {
				this.$router.push({
					name: "index"
				})
			},
			// 回到顶部
			// backTop(){
			// 	this.$emit('backTop')
			// }
			

			// //判断是否关注公众号
			// followTest() {
			// 	location.href='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=Mzg4MTAxMTU2Nw==&scene=124#wechat_redirect'
			// }
		},
		beforeCreate() {
			this.$store.commit("updateTabbar", { tabbar: -1 });
			this.$store.commit("updateShowBack", { showBack: true });
			// this.$store.commit("updateShowTitleImg", { showTitleImg:  true})
			// this.$store.commit("updateIsHfolloweader", { isHeader: false }); // 显示头部
			this.$nextTick ( () => {
				this.activityId = this.$route.params.activityId;
				this.activityType = this.$route.params.activityType;
				this.getActivityDetail();
				this.getJudge();
				this.getsupport();
				this.getUserInfo();
				// this.isfollowed = true
				// this.$store.commit("updatePageTitle", { pageTitle:  document.title = typeToText[this.activityType - 2]})
				this.ajax({
			        method: "get",
			        url: '/app/wechat/follow?openid=',
			      	success: res => {
				        const isfollowed = res.data.followed == 1 ? true : false // 1 已关注 0 未关注
				        	this.isfollowed = isfollowed
				        },
			        fail: error => {console.log(error, '获取是否关注失败!')}
			    })
			})
		},
		destroyed () {
			this.$store.commit("updateShowTitleImg", { showTitleImg:  false})
		   if (localStorage.getItem("userNow")) {
			   	localStorage.removeItem("userNow")
			   	// this.$store.commit("updateUser", { userNow: '' });
		   }
		},
		data() {
			return {
				busy: false,
				showShadow: false,
				isfollowed: false, // 是否关注公众号
				showShare: false,
				teamName: '',
				dayList: [ '15', '30' ],
				localUserHead: '',
				supportType: [],
				joinInType: [],
				supportPeople: [],
				supportAmount: '',
				userId: '',
				pageNum: 1,
				pageSize: 1000,
				detailInfo: {
					userVo: {}
				}, //活动详情信息
				judgeList: [], //评论列表
				activityId: "", //活动ID
				activityType: "", //活动类型
				form: {
					moneyF: null,
					mesa: "加油！",
					entermoney: '' ,
					moneyJ: null,
					joinmoney: '',
					message: "",
					activityDay: '',
					teamName: ''
				},
				showFollow: false, // 提示用户关注弹层
				showActiondetail: false, // 是否显示更多活动详情信息
				actiondetailBtn: true, // 是否显示更多活动详情信息按钮
				showJoinNotice: false, // 是否显示更多报名须知
				joinnoticeBtn: false, // 是否显示更多报名须知按钮
				showIntroduction: false, // 是否显示发起人介绍
				introBtn: false, // 是否显示更多发起人介绍
				showWater: false, // 是否显示已完成水印
				detailLogo: require("~assets/kiw/ph@2x.png"),
				profilImg: require("~assets/kiw/avatar.jpeg"),
				numNow: 0,
				index: 0,
				showSupport: false,
				showJoinIn: false,
				getBarWidth: function(index) {
					return 55 / 12 + "rem";
				},
				actionList: [ "活动详情", "报名须知", "发起人介绍" ],
				writeimg: require("~assets/pisco/write.png"),
				moneyList: ["1", "5", "10", "66", "88"],
				showmember: false,



				showInput: -1,
				formMsg: { answerContent: [] },
				localUserName: '',
			};
		}
	};
</script>
<style lang="less" scoped>
	.activitydetail {
		background: #eee;
		min-height: 100%;
		overflow: hidden;
		padding-bottom: 3.67rem;
		.cover-img {
			width: 100%;
			height: 15rem;
			position: relative;
			.dec {
				display: flex;
				width: 100%;
				height: 3.17rem;
				background: rgba(65, 65, 65, 0.6);
				color: #fff;
				font-size: 0.83rem;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				line-height: 3.17rem;
				position: absolute;
				bottom: 0;
				.user {
					// width: 40%;
					display: flex;
					align-items: center;
					.profil {
						background: transparent center no-repeat;
						background-size: cover;
						width: 2.33rem;
						height: 2.33rem;
						border-radius: 50%;
						margin-left: 1rem;
					}
					.name {
						flex-shrink: 0;
						// font-size: 1rem;
						font-size: 1.2rem;
						margin-left: 1rem;
					}
					.teamName {
						margin-left: 1rem;
						color: rgb(248, 195, 1);
						font-size: 1.2rem;
				    overflow: hidden;
				    text-overflow: ellipsis;
				    white-space: nowrap;
					}
				}
				.words {
					width: 60%;
					letter-spacing: 2px;
				}
			}
		}
		.water {
			width: 10rem;
			height: 10rem;
			position: absolute;
			right: 1rem;
			top: 11rem;
			img {
				width: 100%;
			}
		}
		.supportdecl {
			width: 100%;
			// padding: 1rem;
			background: #fff;
			margin-top: 1rem;
			.words {
				width: 96%;
				color: #000;
				font-size: 1.2rem;
			    margin: auto;
			    padding: 10px 0;
			    span {
			    	font-size: 1.4rem;
			    	font-weight: bold;
			    }
			}
		}
		.actionInfo {
			width: 100%;
			background: #fff;
			margin-top: 1rem;
			padding: 1rem;
			.actionName {
				font-size: 1.42rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(65, 65, 65, 1);
				line-height: 2rem;
			}
			.actionTime {
				font-size: 0.83rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(152, 152, 152, 1);
				line-height: 1.17rem;
				margin-top: 0.6rem;
			}
			.leftTime {
				width: 100%;
				text-align: center;
				font-size: 1.67rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(65, 65, 65, 1);
				line-height: 2.33rem;
				margin-top: 1rem;
				.dayNum {
					color: red;
				}
			}
		}
		.actionFee {
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-top: 1rem;
			padding: 1rem;
			background: #fff;
			.joinFee,
			.needFee,
			.supportNum {
				text-align: center;
			}
			.topnum {
				font-size: 1.42rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(65, 65, 65, 1);
				line-height: 2rem;
			}
			.bottomname {
				font-size: 1rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(152, 152, 152, 1);
				margin-top: 0.3rem;
			}
			.line {
				width: 1px;
				height: 1.5rem;
				border: 0.08rem solid rgba(232, 232, 232, 1);
			}
		}
		.progress {
			margin-top: 1rem;
			.name {
				font-size: 1rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(65, 65, 65, 1);
				line-height: 1.42rem;
				margin-left: 1rem;
				letter-spacing: 1px;
			}
			.processbg {
				width: 100%;
				height: 3rem;
				background: #fff;
				margin-top: 1rem;
				padding-top: 1rem;
				.process {
					width: 29.25rem;
					height: 0.5rem;
					margin: 0 auto;
					background: rgba(238, 238, 238, 1);
					border-radius: 0.5rem;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					p {
						height: 0.5rem;
						background: rgba(248, 195, 1, 1);
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
				.moneynow{
					color: #c8c8c8;
					margin-top: 0.8rem;
					text-align: right;
					padding-right: 1rem;
				}
			}
		}
		.join {
			.name {
				padding: 1rem;
				font-size: 1rem;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(65, 65, 65, 1);
				line-height: 1.42rem;
			}
			.joins {
				&.hidd {
					height: 3rem;
					overflow: hidden;
				}
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
				width: 100%;
				max-width: 100%;
				background: #fff;
				padding-bottom: 1rem;
				.joinitem {
					margin-left: 1rem;
					margin-top: 0.5rem;
					text-align: center;
					.joinlogo {
						width: 3rem;
						height: 3rem;
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
						width: 4rem;
						overflow: hidden;
						white-space: nowrap;
						text-overflow:ellipsis;
						margin-left:-0.5rem;
					}
				}
				.hiddmore {
					margin-left: 1rem;
					margin-top: 0.5rem;
					text-align: center;
					width: 3rem;
					height: 3rem;
					line-height: 3rem;
					font-size: 1.2rem;
				}
			}
			.showmore {
				width: 2rem;
				height: 2rem;
				padding: 0 0.5rem;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.dot {
					width: 0.3rem;
					height: 0.3rem;
					color: #989898;
					border-radius: 50%;
					background: rgba(152, 152, 152, 1);
				}
			}
		}
		.actiontab {
			margin-top: 1rem;
			.joinnotice,
			.actiondetail,
			.group {
				position: relative;
				padding: 1rem;
				max-height: 25.5rem;
				overflow: hidden;
				font-size: 1.25rem;
				font-family: PingFang-SC-Medium;
				background: #fff;
				&.auto {
					padding-bottom: 3.17rem;
					max-height: unset;
					overflow: unset;
				}
				.showmore {
					width: 100%;
					height: 3.17rem;
					position: absolute;
					bottom: 0;
					left: 0;
					font-size: 1.25rem;
					font-family: PingFangSC-Regular;
					font-weight: 400;
					color: rgba(255, 255, 255, 1);
					line-height: 3.17rem;
					text-align: center;
				}
			}
		}
		.feeling {
			width: 100%;
			height: 4rem;
			background: rgba(255, 255, 255, 1);
			text-align: center;
			line-height: 4rem;
			margin-top: 1rem;
			display: flex;
			justify-content: space-around;
			.feelnow {
				font-size: 1.42rem;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(65, 65, 65, 1);
				width: 100%;
			}
			.cover-img {
				width: 2rem;
				height: 2rem;
				padding: 1rem;
			    background-size: 2rem 2rem;
			}
		}
		.judges {
			margin-top: 1rem;
			width: 100%;
			background: #fff;
			.judgement {
				padding: 1rem;
				display: flex;
				border-bottom: 1px solid rgba(243, 243, 243, 1);
				.cover-img {
					width: 3.33rem;
					height: 3.33rem;
					border-radius: 50%;
				}
				.right {
					margin-left: 1rem;
					flex-grow: 1;
					.name {
						font-size: 1.25rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(65, 65, 65, 1);
						line-height: 1.75rem;
					}
					.content {
						font-size: 1rem;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(127, 127, 127, 1);
						line-height: 1.42rem;
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
		.rightitem {
			position: fixed;
			right: 1rem;
			top: 35%;
			.rightimg {
				width: 5.2rem;
				height: 5.2rem;
				background: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				border-radius: 50%;
				margin-top: 2rem;
				img {
				width: 2.6rem;
				height: 2.6rem;
				}
				.name {
					font-size: 0.9rem;
				}
			}
			.rightimg2 {
				width: 5.2rem;
				height: 5.2rem;
				background: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				border-radius: 50%;
				img {
				width: 2.6rem;
				height: 2.6rem;
				}
				.name {
					font-size: 0.9rem;
				}
			}
		}
		.finished {
			width: 100%;
			height: 3.67rem;
			background: #C8C8C8;
			font-size: 1.42rem;
			color: #fff;
			line-height: 3.67rem;
			text-align: center;
		}
	}
	.bottom {
		display: flex;
		justify-content: space-between;
		width: 100%;
		background: #fff;
		margin-top: 1rem;
		position: absolute;
		bottom: 0;
		.getin {
			&.active {
				width: 100%;
			}
			width: 50%;
			height: 3.67rem;
			background: rgba(248, 103, 0, 1);
			color: #fff;
			line-height: 3.67rem;
			font-size: 1.25rem;
			letter-spacing: 1px;
			text-align: center;
			&.finished {
				width: 50%;
				pointer-events: none;
				height: 3.67rem;
				background: #C8C8C8;
				font-size: 1.42rem;
				color: #fff;
				line-height: 3.67rem;
				text-align: center;
			}
		}
		.friend {
			width: 50%;
			height: 3.67rem;
			background: rgba(248, 195, 1, 1);
			color: #fff;
			line-height: 3.67rem;
			font-size: 1.25rem;
			letter-spacing: 1px;
			text-align: center;
			&.finished {
				width: 50%;
				pointer-events: none;
				height: 3.67rem;
				background: #C8C8C8;
				font-size: 1.42rem;
				color: #fff;
				line-height: 3.67rem;
				text-align: center;
			}
		}
	}
	.dialog-demo {
		.cover-img {
			width: 4.83rem;
			height: 4.83rem;
			border-radius: 50%;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			z-index: 10000;
		}
		.vux-close {
			position: absolute;
			left: 1rem;
			top: 1rem;
		}
		.money {
			max-width: 280px;
			margin: 0 auto;
			margin-top: 5rem;
			.moneylist {
				max-width: 280px;
				display: flex;
				flex-wrap: wrap;
				.moneyitem {
					&.active {
						span {
							background: rgba(248,195,1,1);
						}
					}
					min-width: 6rem;
					height: 3.33rem;
					border: 1px dashed #f8c301;
					margin-top: 1rem;
					margin-left: 0.7rem;
					font-size: 1.2rem;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: rgba(65, 65, 65, 1);
					line-height: 3.33rem;
					text-align: center;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					span {
						display: block;
						min-width: 5.4rem;
						margin-left: 10px;
						height: 2.67rem;
						line-height: 2.67rem;
						background: rgba(248, 195, 1, 0.35);
						border-radius: 0.17rem;
					}
				}
				.enter {
					&.active {
						input {
							background: rgba(248,195,1,1);
						}
					}
					width: 6rem;
					height: 3.33rem;
					border: 1px dashed #f8c301;
					margin-top: 1rem;
					margin-left: 0.7rem;
					font-size: 1.42rem;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					input {
						width: 5.33rem;
						height: 2.67rem;
						line-height:2.67rem;
						background: rgba(248, 195, 1, 0.35);
						border-radius: 0.17rem;
						border: none;
						text-align: center;
						font-size: 1.42rem;
					}
					input:focus {
						outline: none;
					}
				}
			}
		}
		.form {
			padding: 1rem;
		}
		.pay {
			&.btn {
				margin: 10px;
				height: auto;
				line-height: 2;
				display: inline-block;
				float: right;
				width: 6em
			}
			&.default {
				float: left;
				background-color: #999
			}
			width: 18rem;
			height: 3.33rem;
			background: rgba(248, 195, 1, 1);
			border-radius: 0.17rem;
			font-size: 1.42rem;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			margin: 3rem auto;
			line-height: 3.33rem;
			text-align: center;
		}
	}
	.eva-right {
		color: #f86700;
		float: right;
	}
	.grow {
		flex-grow: 1
	}
	.sharebox{
	    z-index: 1000;
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.5);
		color: #fff;
		font-size: 18px;
		text-align: center;
		letter-spacing: 1px;
		.arrow {
			width: 100%;
			margin-top: 4rem;
			margin-left: -1rem;
			text-align: right;
			img {
				width: 7rem;
			}
		}
		.timeline {
			display: inline-block;
			background: #d8667a;
			padding: 0 5px;
		}
		.rightnow {
			margin-top: 1.2rem;
			display: flex;
			align-items: center;
			justify-content: center;
			.line {
				display: inline-block;
				width: 3rem;
				height: 1px;
				background: #fff;
				margin: 0 10px;
			}
		}
	}
	.shadow {
		z-index: 999;
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0);
	}
	.em {
		font-size: 1.2em;
		text-align: left
	}
</style>