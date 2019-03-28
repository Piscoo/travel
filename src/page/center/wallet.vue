<template>
	<div>
		<div class="money">
			<p>¥{{balance}}</p>
			<span>余额</span>
			<span style="display:block;font-size:0.8em;color:#999">充值成功后,可能有几分钟延误！可稍后刷新确认</span>
		</div>
		<grid class="grid" :show-vertical-dividers="dividers">
			<grid-item class="grid-item" :link="{name: 'recharge'}">
				<img src="~assets/kiw/icon_myself_recharge_normal@2x.png" alt>
				<span>充值</span>
			</grid-item>
			<grid-item class="grid-item" :link="{name: 'cash'}">
				<img src="~assets/kiw/icon_myself_recharge_normal1@2x.png" alt>
				<span>提现</span>
			</grid-item>
		</grid>
		<p style="margin:2rem 0 1rem 1rem">账单明细</p>
		<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
			<div class="card" v-for="(item,index) in list" :key="index">
				<div class="bill">账单号 {{item.orderNo}}</div>
				<div class="time">{{item.createTime}}</div>
				<div class="recharge">
					<span>充值</span>
					<span>+{{item.amount}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { XHeader, Grid, GridItem } from "vux";
export default {
	name: "wallet",
	components: { XHeader, Grid, GridItem },
	beforeCreate() {
		this.$store.commit("updateTabbar", { tabbar: 3 });
		this.$store.commit("updateShowBack", { showBack: true });
		// this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
		this.$nextTick(() => {
			this.getBill();
		})
		this.ajax({
			method: "get",
			url: "/app/user",
			data: {},
			success: res => {
				this.balance = res.data.balance;
			}
		})
	},
	data() {
		return {
			dividers: false,
			list: [],
			pageNum: 1,
			pageSize: 10,
			balance: "",
			busy: false,
			data: []
		};
	},
	mounted() {
	},
	methods: {
		/**
		 * [loadMore 加载更多]
		 */
		loadMore: function() {
	      this.getBill()
	    },
	    getBill(pageNo) {
	    	const pageNum = pageNo || this.pageNum
	    	this.busy = true
	    	this.ajax({
	    		method: "post",
	    		url: "/app/payStatement/myBillDetail",
	    		data: {
	    			pageNum,
	    			pageSize: this.pageSize
	    		},
	    		success: res => {
	    			if (res.data) {
	    				this.pageNum = pageNum + 1
		    			this.list = this.list.concat(res.data.list || [])
		    			if (this.list.length >= this.pageSize * pageNum) {
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
	}
};
</script>
<style lang="less" scoped>
.money {
	display: flex;
	flex-direction: column;
	background: #fff;
	text-align: center;
	padding: 2rem 0;
	p {
		color: #ff0000;
		font-size: 2.33rem;
		line-height: 3.33rem;
	}
	span {
		font-size: 1.42rem;
	}
}
.grid {
	margin-top: 1rem;
	background: #fff;
	.grid-item {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		img {
			width: 2.71rem;
			height: 2.71rem;
		}
	}
}
.card {
	background: #fff;
	padding: 1rem;
	border-bottom: 1px solid #f3f3f3;
	.bill {
		font-size: 1rem;
	}
	.time {
		font-size: 0.83rem;
		color: rgba(152, 152, 152, 1);
		line-height: 1.17rem;
	}
	.recharge {
		font-size: 1.25rem;
		font-weight: 500;
		color: rgba(65, 65, 65, 1);
		line-height: 1.75rem;
		span:last-child {
			color: #f8c301;
			float: right;
		}
	}
}
.card:last-child {
	border-bottom: 1px solid transparent;
}
</style>

