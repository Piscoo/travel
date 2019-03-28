<template>
	<div class="friend">
		<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
			<div class="item" v-for="item in friendList">
				<img :src="item.headUrl" alt="">
				<div class="info">
					<div class="name">{{item.userName}}</div>
					<div class="idNumber">ID <span>{{item.userNo}}</span></div>
				</div>
				<div class="times">
					<p>支持次数<span>{{item.activitySupportTotal}}</span></p>
					<p>留言次数<span>{{item.activityRatingTotal}}</span></p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { Group } from "vux";
export default {
	name: "cash",
	components: { Group },
	beforeCreate() {
		this.$store.commit("updateTabbar", { tabbar: 3 });
		this.$store.commit("updateShowBack", { showBack: true });
		// this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
		// /app/user/friends
		this.$nextTick(() => {
			this.getFriends()
		})
	},
	methods: {
		/**
		 * [loadMore 加载更多]
		 */
		loadMore: function() {
	      this.getFriends()
	    },
		getFriends(pageNo) {
			const page = pageNo || this.page
			this.busy = true
			this.ajax({
				method: "get",
				url: "/app/user/friends",
				data: {
					page: page,
					limit: this.limit,
				},
				success: res => {
					if (res.data) {
						this.page = page + 1
						this.friendList = this.friendList.concat(res.data.list || [])
						if (this.friendList.length >= this.limit * page) {
							this.busy = false
						} else {
							this.busy = true
						}
					} else {
						this.busy = true
					}
				}
			})
		}
	},
	data() {
		return {
				value:"",
				friendList:[],
				page: 1,
				limit: 10,
				busy: false,
				data: []
		};
	}
};
</script>
<style lang="less" scoped>
		.friend{
				.item{
						padding: 1rem;
						display: flex;
						position: relative;
						border-bottom: 1px solid #f3f3f3;
						img{
								width:3.33rem;
								height:3.33rem;
								border-radius: 50%;
						}
						.info{
								margin-left:1rem;
								.idNumber{
										color:#7F7F7F
								}
						}
						.times{
								// border:1px solid red;
								width:max-content;
								position: absolute;
								left:100%;
								transform: translateX(-100%);
								padding-right:1rem;
								color:#989898;
						}
				}
				
		}
</style>
