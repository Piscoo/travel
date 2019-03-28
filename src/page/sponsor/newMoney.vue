<template>
  <div class="newMoney">
    <form ref="form">
      <group class="box">
        <x-input title="新增金额:" v-model="form.newmoney" type="number" placeholder="请填写金额"></x-input>
      </group>
    </form>
  </div>
</template>
<script>
import { XInput, Group, Toast } from "vux";
export default {
  name: "newMoney",
  components: { XInput, Group, Toast },
  methods: {
    saveMoney() {
      let supportKey = localStorage.getItem("supportKey")
        ? JSON.parse(localStorage.getItem("supportKey"))
        : [];
      supportKey.push(this.form.newmoney);
      localStorage.setItem("supportKey", JSON.stringify(supportKey));
      this.$router.back(-1);
      this.$vux.toast.show({
        text: "保存成功"
      });
    }
  },
  beforeCreate() {
    this.$store.commit("updateTabbar", { tabbar: -1 });
    this.$store.commit("updateShowMore", { showMore: "保存" });
    // this.$store.commit("updateShowBack", { showBack: true });
    // this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
  },
  created() {
    this.$store.commit("updateClickMore", { onClickMore: this.saveMoney });
  },
  data() {
    return {
      form: { newmoney: "" }
    };
  }
};
</script>
<style lang="less" scoped>
.newMoney {
  .top {
    width: 100%;
    background: #f8c301;
    .topbar {
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      width: 94%;
      height: 46px;
      color: #fff;
      font-size: 18px;
      line-height: 46px;
      .img {
        width: 0.78rem;
        height: 1.58rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .box {
    width: 100%;
    height: 4.67rem;
    background: rgba(255, 255, 255, 1);
    font-size: 1.33rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(65, 65, 65, 1);
    line-height: 1.83rem;
  }
}
</style>
