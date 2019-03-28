<template>
  <div>
    <group>
      <x-input title="充值金额" v-model="value" type="number" placeholder="请填写充值额度"></x-input>
    </group>
    <p>
      当前余额:
      <span>{{balance}}</span>
    </p>
    <div class="pay" @click="wechatPay">微信支付</div>
  </div>
</template>
<script>
import { XHeader, Group, XInput, Toast } from "vux";

export default {
  name: "cash",
  components: { XHeader, Group, XInput, Toast },
  beforeCreate() {
    this.$store.commit("updateTabbar", { tabbar: 3 });
    this.$store.commit("updateShowBack", { showBack: true });
    // this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部

    this.ajax({
      method: "get",
      url: "/app/user",
      data: {},
      success: res => {
        this.balance = res.data.balance;
      }
    });
  },
  methods: {
    wechatPay() {
      if (!this.value || this.value ==0) {
        this.$vux.toast.show({
          text: "请输入充值金额",
          type: "cancel"
        });
        return;
      }
      this.ajax({
        method: "post",
        url: "/app/wechat/pay/recharge",
        data: {
          total_fee: this.value
        },
        success: res => {
          if (res.code == 0) {
            this.$callWxPay(res.data, () => {
              this.$router.push({
                name: "wallet"
              });
            });
          } else {
            // this.$dialog.toast({mes: res.msg, timeout: 1500, icon: 'error'})
          }
        }
      });
    }
  },
  data() {
    return {
      value: "",
      balance: ""
    };
  }
};
</script>

<style lang="less" scoped>
p {
  float: right;
  margin: 1rem 1rem 0 0;
  color: #848484;
}
.pay {
  background: #f8c301;
  width: 100%;
  height: 4.08rem;
  line-height: 4.08rem;
  text-align: center;
  color: #000;
  position: fixed;
  bottom: 3.8rem;
  font-size: 1.42rem;
}
</style>


