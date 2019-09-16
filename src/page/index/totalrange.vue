<template>
    <div class="totalrange">
		<div class="cover-img" :style="'background-image: url('+teamlogo+')'"></div>
		<tab :line-width="3" active-color="#F8C301" v-model="index" :custom-bar-width="getBarWidth">
			<tab-item class="vux-center" v-for="(item, index) in teamList" :key="index" @on-item-click="changeCode(index)">{{item}}</tab-item>
		</tab>
		<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
			<div class="itemlist">
				<div class="item" v-for="(item, index) in supportList">
					<div class="left">
						<div class="cover-img" :style="'background-image: url('+(item.headUrl ||require('~assets/kiw/avatar.jpeg')) +')'" @click="toHisAct(item.id)"></div>
					</div>
					<div class="right">
						<div class="namemoney">
							<span class="name one-line" :class="index <= 2? 'active' : ''">{{index+1}}.{{item.userName}}</span>
							<span class="money no-shrink" v-show="typeCode == 0">{{item.supportAmount}}元</span>
							<span class="money no-shrink" v-show="typeCode == 1">{{useTime}}</span><!-- 速度榜使用的时间 -->
						</div>
						<div class="teamName">战队：{{item.teamName}}</div>
						<div class="finish"><span class="progress" v-show="typeCode != 2">已完成：{{item.supportCountPercent}}%</span><span class="num">支持人数：{{item.supportCount}}</span></div>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>
<script>
	import { Tab, TabItem } from "vux";
	export default {
	  name: "totalrange",
	  components: { Tab, TabItem },
	  beforeCreate() {
	    this.$store.commit("updateTabbar", { tabbar: 0 });
	    this.$store.commit("updateShowBack", { showBack: true });
	    // this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
	    this.$nextTick ( () => {
			this.activityId = this.$route.params.activityId
		  	this.getSupportNum()
		})
	  },
	  methods: {
		/**
		 * [loadMore 加载更多]
		 */
		loadMore: function() {
	      this.getSupportNum()
	    },
	    // 总榜信息
	  	getSupportNum(pageNo) {
	  		const pageNum = pageNo || this.pageNum
	  		this.busy = true
	  		this.ajax({
	  			method: "post",
	  			url: "/app/activities/genera",
	  			data: {
	  				activityId: this.activityId,
	  				generaTypeCode: this.typeCode,
	  				pageNum,
	  				pageSize: this.pageSize
	  			},
	  			headers: {
		            "Content-Type": "application/x-www-form-urlencoded"
		        },
	  			success: res => {
	  				if (res.data.list) {
	  					this.pageNum = pageNum + 1
	  					if(this.typeCode == 1) {
	  						res.data.list.map(i => {
	  							const day = parseInt(i.finishTime/60/24)
	  							const leftHourTime = i.finishTime - day*24*60
	  							const hour = parseInt(leftHourTime/60)
	  							const minutes = leftHourTime%60
	  							this.useTime = `${day}天${hour}小时${minutes}分钟`
	  						})
	  					}
	  					this.supportList = this.supportList.concat(res.data.list || [])
	  					if (pageNum >= res.data.totalPage ) {
	  						this.busy = true
	  					} else {
	  						this.busy = false
	  					}
	  				} else {
	  					this.busy = true
	  				}
					for(var i=0; i<res.data.list.length;i++){
						res.data.list[i].supportCountPercent =  ((res.data.list[i].actualSupportAmount /res.data.list[i].supportAmount)*100).toFixed(2);
						res.data.list[i].supportAmount =  (res.data.list[i].supportAmount).toFixed(2)
					}
	  			}
	  		});
	  	},
	  	changeCode(index) {
	  		if(this.typeCode == index) {
	  			return
	  		} else {
	  			this.typeCode = index
		  		this.supportList = []
		  		this.getSupportNum(1)
	  		}
	  	},
	  	//点击头像前往对应用户的活动
		toHisAct(id) {
			this.$router.push({
				name: 'activitydetail',
				params: {
					activityType: 6,
					activityId: id
				}
			})
		},
	  },
	  data() {
	    return {
		    busy: false, // 加载中
	    	activityId: '',
	    	typeCode: 0,
			pageNum: 1,
			pageSize: 10,
			supportList: [],
	    	teamlogo: require('~assets/pisco/teamlogo.png'),
	    	itemlogo: require('~assets/kiw/avatar.jpeg'),
	    	teamList: ['人气榜', '速度榜', '团队榜'],
	    	index: 0,
	    	getBarWidth: function(index) {
	    		return 55 / 12 + "rem";
	    	},
	    	useTime: ''
	    };
	  }
	};
</script>
<style lang="less" scoped>
	.totalrange {
		.cover-img {
			width: 100%;
			height:12.17rem;
		}
		.itemlist {
			margin-top: 1rem;
			.item {
				padding: 1rem;
				display: flex;
				align-items: center;
				.left {
					width: 7rem;
					height: 7rem;
					flex: 1;
					.cover-img {
						width: 6rem;
						height: 6rem;
						margin-top:0.5rem;
						border-radius: 50%;
					}
				}
				.right{
					flex: 4;
					height: 7rem;
					min-width: 0;
					padding-left: 1rem;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					.namemoney,.finish {
						display: flex;
						justify-content: space-between;
					}
					.name {
						&.active {
							color:rgba(248,195,1,1);
						}
					    width: 14rem;
					    height: 2rem;
					    line-height: 2rem;
						font-size:1.42rem;
						font-weight:500;
						color:rgba(65,65,65,1);
						min-width: 0;
					    overflow: hidden;
					    white-space: nowrap;
					    text-overflow: ellipsis;
					}
					.money {
						font-size:1.3rem;
						font-weight:500;
						color:rgba(255,0,0,1);
						flex-shrink: 0;
					    min-width: 0;
					    word-break: break-word;
					    display: inline-block;
					}
					.progress {
						font-size:1.25rem;
						font-weight:500;
						color:rgba(152,152,152,1);
					}
					.num {
						font-size:1rem;
						font-weight:500;
						color:rgba(152,152,152,1);
					}
					.teamName {
						font-size:1.25rem;
					}
				}
			}
		}
	}
</style>