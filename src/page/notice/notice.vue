<template>
	<div class="notice">
		<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
			<div class="item" v-for="(item, index) in noticeList" :key="index">
				<div><img src="~assets/pisco/list_icon_comment_normal.png" alt=""></div>
				<div class="info">
					<div class="name">{{noticeType[item.type]}}</div>
					<div class="time">{{item.createTime}}</div>
					<div class="detail">
						<p> 
							<template v-for="(text, index2) in item.content">
								<span><!-- {{item.content[0]}} -->{{text}}</span>
								<span class="yellow" v-if="item.fillContent[index2]" @click="toDetail(item.urlType, item.serialId)">"{{item.fillContent[index2]}}"</span>
							 <!--  <span>{{item.content[1]}}</span> -->
							</template>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Grid, GridItem, Group, Cell } from "vux";
export default {
	components: { Grid, GridItem, Group, Cell },
	beforeCreate() {
		this.$store.commit("updateTabbar", { tabbar: 2 });
		// this.$store.commit("updateShowBack", { showBack: true });
		// this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
	},
	created() {
		this.getMessgae()
	},
	data() {
		return {
			page: 1,
			limit: 10,
			data: [], // 加载更多
			busy: false, // 加载中
			noticeList: [],
			noticeType: ['', '系统消息']
		};
	},
	methods: {
		/**
		 * [loadMore 加载更多]
		 */
		loadMore: function() {
			this.getMessgae()
		},
		getMessgae(pageNo) {
			const page = pageNo || this.page
			this.busy = true
			this.ajax({
				method: 'get',
				url: '/app/user/messages',
				data: {
					page: page,
					limit: this.limit
				},
				success: (res) => {
					console.log(res)
					if (res.data) {
						this.page = page + 1
						let noticeList = res.data.list
						noticeList.map(list => {
							list.content = (list.content || '').split('{fillContent}')
							list.fillContent = (list.fillContent || '').split('&')
							return list
						})
						this.noticeList = this.noticeList.concat(noticeList)
						if (noticeList.length >= this.limit * page) {
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
		toDetail(type, id = '') {
			switch (type) {
				case 1:
					this.$router.push({
						path: '/index/notice/' + id
					})
					break
			}
		}
	},
};
</script>

<style lang="less" scoped>
.notice {
	min-height: 100%;
	.item {
		background: #fff;
		padding: 1rem;
		display: flex;
		position: relative;
		border-bottom: 1px solid #f3f3f3;
		img {
			width: 3.33rem;
			height: 3.33rem;
			border-radius: 50%;
		}
		.info {
			margin-left: 1rem;
			.name,
			.detail {
				font-size: 1.17rem;
				color: #414141;
			}
			.time {
				font-size: 1rem;
				color: #989898;
			}
			.yellow {
				color: #f8c301;
			}
		}
	}
}
</style>
