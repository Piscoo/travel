<template>
	<div class="support">
		<form ref="form">
			<group style="display:none;" gutter="0">
				<checklist :options="[1]" :max="1"><span></span></checklist>
			</group>

			<div ><!---->  
				<div class="weui-cells vux-no-group-title" style="margin-top:0"> 
					<div>
						<div class="weui-cells weui-cells_checkbox" v-for="(item, index) in moneyList">
								<label :for="'checkbox_' + index"  class="weui-cell weui-check_label" >
										<div class="weui-cell__hd" >
											<input type="checkbox" name="vux-checkbox" :id="'checkbox_' + index" class="weui-check" :value="item" v-model="form.payAmounts">
											<i class="weui-icon-checked vux-checklist-icon-checked"></i>
										</div> 
									<div class="weui-cell__bd"><p >{{item}}元  <span v-show="moneyDefault.indexOf(item) !== -1">（默认）</span></p> <!--  v-show="item == moneyDefault" --></div>
								</label>
								 <span class="right" v-show="moneyDefault.indexOf(item) === -1" @click.stop.prevent="deleteitem(index)">删除</span>
						</div>
					</div>
				</div>
			</div>
			<router-link :to="{ name: 'newMoney' }">
				<div class="newType" v-show="moneyList.length===10?false:true">新增支持方案</div></router-link>
			<group>
					<x-switch title="获得支持者地址" v-model="form.isGetSupportAddress"></x-switch>
			</group>
		</form>
		<div class="notice">
				<div class="title">须知</div>
				<div class="detail">您可以多选以下方案作为你支持方案,如不满意您还可以自定义新增方案,记得要给你的支持者一些回报哦!</div>
		</div>
		<div class="gonext" @click="posting">继续下一步</div>
	</div>
</template>
<script>
	import { XTextarea, Group, Checklist,XSwitch  } from "vux";
	export default {
		name: "support",
		components: { XTextarea, Group, Checklist,XSwitch },
		beforeCreate() {
			this.$store.commit("updateTabbar", { tabbar: -1 });
			// this.$store.commit("updateShowMore", { showMore: false });
			// this.$store.commit("updateShowBack", { showBack: true });
			// this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
			this.$nextTick(function () {
				let supportForm = localStorage.getItem("supportForm")
				if (supportForm) {
					this.form = JSON.parse(supportForm)
				}
			})
		},
		data() {
				return {
					ten: '',
					form: {
						isGetSupportAddress: false,
						payAmounts: []
					},
					payAmounts: [], // 支持方式数组
					moneyList: [1, 5, 10, 66, 88],
					moneyDefault: [1, 5, 10, 66, 88],
					activityId: ''
				};
		},
		created () {
			var key = localStorage.getItem('supportKey')
			if (key) {
				this.moneyList  = this.moneyList.concat(JSON.parse(key))
			}
		},
		watch: {
			'form.payAmounts': {
		      handler (val, oldValue) {
		        if (val.length > 5) {
		        	 val.splice(0, 1)
		        	this.form.payAmounts = val
		        }
		      },
		      deep: true
		    }
		},
		methods: {
			//整合所有数据传送给后台
			posting() {
				this.form.payAmounts = this.form.payAmounts.map(Number)
				if (this.formValid()) {
					//拿到之前页面填写的数据拼接上当前页面的内容
					var editForm = JSON.parse(localStorage.getItem('editForm'))
					this.form = Object.assign(editForm, this.form)
					localStorage.setItem("supportForm", JSON.stringify(this.form));
					// debugger
					this.ajax({
						method: 'post',
						url: '/app/activities',
						data: this.form,
						success: (res) => {
							console.log(res)
							this.activityId = res.data
							// 请求成功去往成功页面
							if(res.code === 0) {
								this.$router.push({
									name: 'actionsuccess',
									params: {
										activityId: this.activityId
									}
								})
							}
						}
					})
				}
			},
			//删除支持方案
			deleteitem (index) {
				this.moneyList.splice(index, 1)
				var supportKey = JSON.stringify(this.moneyList).replace(/1,5,10,66,88,{0,1}/, '')
				localStorage.setItem("supportKey", supportKey);
				  this.$vux.toast.show({
					text: "删除成功"
				  });
			}
		},
	};
</script>

<style lang="less" scoped>
	.support {
		position: relative;
		min-height: 100%;
		overflow: hidden;
		.newType, .address {
			width:100%;
			height:4.67rem;
			background:rgba(255,255,255,1);
			margin-top: 0.8rem;
			padding-left: 2rem;
			font-size:1.42rem;
			font-family:PingFang-SC-Medium;
		 font-weight:500;
		 color:rgba(65,65,65,1);
		 line-height:4.67rem;
		}
		.notice{
			padding: 2rem 1rem 1rem;
			.title {
				font-size:1.25rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(248,195,1,1);
				line-height:1.67rem;
			}
			.detail {
				font-size:1rem;
				font-family:PingFang-SC-Medium;
				font-weight:500;
				color:rgba(200,200,200,1);
				line-height:1.67rem;
			}
		}
		.gonext {
			width:100%;
			height:4.08rem;
			background:rgba(248,195,1,1);
			font-size:1.42rem;
			font-family:PingFang-SC-Medium;
			font-weight:500;
			color:rgba(65,65,65,1);
			line-height:4.08rem;
			text-align: center;
			position: absolute;
			bottom: 0;
		}
	}
	.right {
		float: right;
		position: absolute;
		top: 50%;
		right:1rem;
		transform: translateY(-50%);
		color: #f00;
	}
	.weui-cells_checkbox {
		position: relative;
		margin-top: 0;
	}
</style>
