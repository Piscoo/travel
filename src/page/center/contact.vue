<template>
  <div>
    <img class="banner" src="~assets/kiw/ph_five@2x.png" alt>
    <div class="content">
      <div class="phone">
        <p>赛事组委会</p>
        <p><a href="tel:13119408000" style="color:#000;">金先生 13119408000</a> </p>
        <p><a href="tel:13632723331" style="color:#000;">苗先生 13632723331</a> </p>
        <!-- <p>0755-2134-4567</p> -->
      </div>
      <div class="addr">
        <p>联系地址</p>
        <p style="width:55%">深圳市南山区粤海街道深圳湾科技生态园5栋A座1402房</p>
      </div>
      <!-- <div class="email">
        <p>联系邮箱</p>
        <p><a href="mailto:telvyou@work.co" style="color:#000;">telvyou@work.co</a></p>
        <p><a href="mailto:telvyou@work.co" style="color:#000;">telvyou@work.co</a> </p>
      </div>
      <p class="workTime">客服时间: 周一至周五 9：00-18：00</p> -->
    </div>
  </div>
</template>
<script>
import {} from "vux";
export default {
  name: "contact",
  components: {},
  beforeCreate() {
    this.$store.commit("updateTabbar", { tabbar: 3 });
    this.$store.commit("updateShowBack", { showBack: true });
    // this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
  },
  methods: {},
  data() {
    return {
      value: ""
    };
  }
};
</script>
<style lang="less" scoped>
.banner {
  width: 100%;
  height: 12rem;
}
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  margin-top:3rem;
  font-size:1.25rem;
}
.content >div {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}
.workTime{
    margin-top:3rem;
    color:#848484;
    font-size:1rem;
    text-align: center;
}   
</style>


