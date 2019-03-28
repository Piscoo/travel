<template>
	<div class="edit">
		<form ref="form">
			<group gutter="0">
				<x-textarea :max="1000" placeholder="添加活动详情内容...." name="details" v-model="form.details" required></x-textarea>
			</group>
			<div class="imageBox">
				<div class="imgBox" v-for="item in imgUrl">
				 	<div class="cover-img" :style="'background-image: url('+item+')'" v-show="item === ''?'false':'true'"></div>
				</div>
				<label class="plus" for="chooseImg"><img src="~assets/pisco/plus.png" alt=""></label>
			</div>
			<input type="file" id="chooseImg" @change="chooseImg" class="visibility-none">
		</form>
			<div class="savenext" @click="toSupport">保存继续</div>
	</div>
</template>
<script>
import { XTextarea, Group  } from "vux";
export default {
	name: "edit",
	components: { XTextarea, Group },
	beforeCreate() {
		this.$store.commit("updateTabbar", { tabbar: -1 });
		// this.$store.commit("updateShowBack", { showBack: true });
		// this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
		this.$nextTick(function() {
			let editForm = localStorage.getItem("editForm")
			if (editForm) {
				this.form = JSON.parse(editForm)
				this.imgUrl = JSON.parse(localStorage.editForm).detailsImgPath
			}
		})
	},
	data() {
		return {
			imgUrl: [], // 上传的图片
			//detailsImgPath: [], // 后台返回的图片地址数组
			requires: [ "details", "detailsImgPath|请上传图片!"], //必填字段
			form: { 
				details: "",
				detailsImgPath: [] 
			}
		};
	},
	methods: {
		// 选择图片，单张逐次上传
		chooseImg (e) {
			var file = e.target.files[0]
			console.log(e.target.files[0])
			this.imgUrl.push(URL.createObjectURL(e.target.files[0]))
			var formData = new FormData()
			formData.append('file',  file)
			this.ajax({
				method: 'post',
				url: '/app/oss/upload',
				data: formData,
				headers: {
				  'Content-Type':  'application/x-www-form-urlencoded;charset=UTF-8'
				},
				success: (res) => {
					console.log(res)
					this.form.detailsImgPath.push(res.url)
					console.log(this.form.detailsImgPath)
				}
			})
		},
		//点击去往下一步，support.vue
		toSupport() {
			if (this.formValid()) {
				//获取上一页面存储的缓存数据
				var sponsorForm = JSON.parse(localStorage.getItem('sponsorForm'))
				//拼接上当前页面的数据
				localStorage.setItem('editForm', JSON.stringify(Object.assign(sponsorForm, this.form)))
				this.$router.push({
					path: '/support',
					name: 'support'
				})
			}
		}
	},
};
</script>
<style lang="less" scoped>
		.edit {
			position: relative;
			min-height: 100%;
			.cover-img {
				width: 5.83rem;
				height: 5.83rem;
			}
			.imageBox {
				display: flex;
				flex-wrap: wrap;
				.imgBox {
					margin-left: 1.8rem;
					margin-top: 1rem;
				}
			}
			.plus {
				width: 5.83rem;
				height: 5.83rem;
				border: 1px dashed #979797;
				margin-left: 1.8rem;
				margin-top: 1rem;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.savenext {
			 	width:31.25rem;
				height:4rem;
				background:rgba(248,195,1,1);
				color: #414141;
				font-size: 1.42rem;
				line-height: 4rem;
				text-align: center;
				position: absolute;
				bottom: 0;
			}
		}
</style>
