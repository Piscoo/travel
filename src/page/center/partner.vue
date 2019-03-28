<template>
  <div>
    <form ref="form" @submit.default="submit">
      <group>
        <x-input is-type="china-name" title="真实姓名:" v-model="form.realName" placeholder="请填写真实姓名"></x-input>
        <x-input is-type="china-mobile" title="联系电话:" v-model="form.phone" placeholder="请填写联系电话"></x-input>
        <x-input title="公司名称:" v-model="form.companyName" placeholder="请填写公司名称"></x-input>
      <!--   <popup-picker
          title="类别："
          :data="categoryList"
          v-model="category"
          placeholder="请选择类别"
          confirm-text="确定"
        ></popup-picker> -->
        <popup-picker
          title="所属行业:"
          :data="industryList"
          v-model="industry"
          placeholder="请选择类别"
          confirm-text="确定"
        ></popup-picker>
      </group>
      <div class="tie">
        <span>关于赛事合伙人推荐的说明</span>
        <p>1.赛事合伙人报名后可以分享推广组建自己的团队参与山河特旅发布的相关活动</p>
        <p>2.赛事合伙人所具有的相关权益，最终解释权归山河特旅所有</p>
      </div>
      <div class="btn" @click="submit">提交</div>
    </form>
  </div>
</template>
<script>
import { Group, XInput, Selector, PopupPicker } from "vux";
export default {
  name: "partner",
  components: { Group, XInput, Selector, PopupPicker },
  beforeCreate() {
    this.$store.commit("updateTabbar", { tabbar: 3 });
    this.$store.commit("updateShowBack", { showBack: true });
    // this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
  },
  data() {
    return {
      category: ["1"], // 类别
      categoryList: [
        [
          "1",
          "2"
        ]
      ], // 类别 数据
      industry: ["农、林、牧、渔业"], // 所属行业
      industryList: [
        [
          "农、林、牧、渔业",
          "采矿业",
          "制造业",
          "电力、燃气及水的生产和供应业",
          "建筑业",
          " 交通运输、仓储和邮政业",
          "信息传输、计算机服务和软件业",
          "批发和零售业",
          "住宿和餐饮业",
          "金融业",
          "房地产业",
          "租赁和商务服务业",
          "科学研究、技术服务和地质勘查业",
          "水利、环境和公共设施管理业",
          "居民服务和其他服务业"
        ]
      ], // 所属行业 数据
      requires: ['realName', 'phone', 'companyName', 'category|请选择类别!', 'industry|请选择所属行业!'],
      form: {
        realName: '', // (string, optional): 真实姓名
        phone: '', // (string, optional): 联系电话
        companyName: '', // (string, optional): 公司名称
        category: '1', // (string, optional): 类别
        industry: '农、林、牧、渔业' // (string, optional): 所属行业
      }
    }
  },
  watch: {
    category (value) {
      this.form.category = value[0]
    },
    industry (value) {
      this.form.industry = value[0]
    }
  },
  methods: {
    submit () {
      if (this.formValid()) {
        this.ajax({
          method: "post",
          url: "/app/teamPartner",
          data: this.form,
          success: res => {
            console.log(res)
            this.$vux.toast.show({text: res.msg})
          }
        })
      }
    }
  }
};
</script>
<style lang="less" scoped>
.tie {
  padding: 2rem 1rem;
  span {
    color: #f8c301;
    font-size: 1.25rem;
  }
  p {
    color: #c8c8c8;
    font-size: 1rem;
    line-height: 1.67rem;
  }
}
.btn {
  width: 100%;
  height: 4rem;
  line-height: 4rem;
  background: #f8c301;
  color: #414141;
  text-align: center;
  font-size: 1.42rem;
  position: fixed;
  bottom: 4rem;
}
</style>
