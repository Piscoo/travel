<template>
	<div>
		<tab :line-width="3" active-color="#F8C301" custom-bar-width="6rem">
			<tab-item selected @on-item-click="handler(false)">发出的留言</tab-item>
			<tab-item @on-item-click="handler(true)">收到的留言</tab-item>
		</tab>
		<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
			<div class="msg" v-for="(item,index) in msgData" :key="index">
				<div class="content">
					<img class="self" :src="item.headUrl" alt>
					<div class="info">
						<p class="info_name">{{item.userName}}</p>
						<p class="info_content">{{item.comment}}</p>
					</div>
					<!-- <img class="others" :src="item.activityImgsPath" alt /> -->
				</div>
				<p class="time">{{item.createTime}}</p>
			</div>
		</div>
	</div>
</template>
<script>
import { Tab, TabItem } from "vux";
export default {
	name: "message",
	components: { Tab, TabItem },
	beforeCreate() {
		this.$store.commit("updateTabbar", { tabbar: 3 });
		this.$store.commit("updateShowBack", { showBack: true });
		// this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
		this.$nextTick( () => {
			this.getMessage()
		})
	},
	data() {
		return {
			value: "",
			msgData: [],
			page: 1,
			activeTab: false,
			limit: 10,
			busy: true,
			data: [],
			isMyReceive: false
		};
	},
	methods: {
		/**
		 * [loadMore 加载更多]
		 */
		loadMore: function() {
			this.getMessage()
		},
		handler(type) {
			if (this.isMyReceive == type) {
				return
			} else if (this.isMyReceive !== type) {
				this.msgData = []
			}
			this.isMyReceive = type
			this.page = 1
			this.getMessage()
		},
		getMessage() {
			this.ajax({
				method: "get",
				url: "/app/user/activity-ratings",
				data: {
					pageNum: this.page,
					pageSize: this.limit,
					isMyReceive: this.isMyReceive
				},
				success: res => {
					if (res.data) {
						console.log(this.msgData.length)
						if (this.msgData.length >= res.data.totalCount) {
							this.busy = true
						} else {
							this.busy = false
							this.msgData = this.msgData.concat(res.data.list || [])
							this.page = this.page + 1
						}
					} else {
						this.busy = true
					}
				}
			})
		}
	}
};
</script>
<style lang="less" scoped>
	.msg {
		display: flex;
		flex-direction: column;
		background: #fff;
		padding: 1rem;
		.content {
			display: flex;
			flex-direction: row;
			position: relative;
			justify-content: space-between;
			img {
				width: 15%;
				height: 15%;
			}
			.info {
				margin: 0 2rem 0 1rem;
				position: relative;
				width: 70%;
				.info_name {
					font-size: 1.25rem;
				}
				.info_content {
					font-size: 1rem;
				}
			}
			.others {
				// position: relative;
				// left:100%;
				// margin-left:-3.33rem;
			}
		}
		.time {
			position: relative;
			margin-left: 15%;
			margin-top: 1rem;
			padding-left: 1rem;
			color: #dcdcdc;
		}
	}
</style>


