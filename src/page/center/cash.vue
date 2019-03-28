<template>
  <div>
    <group>
      <x-input title="提现金额" v-model="total_fee" type="number" placeholder="请填写提现额度" @input="onInput"></x-input>
    </group>
    <p class="balance">
      当前余额:
      <span>{{balance}}</span>
    </p>
    <div class="tie">
      <span>提现提示</span>
      <p>申请提现将在72小时内, 通过微信转账方式,支付到您的微信钱包,请注意查收！</p>
    </div>
    <div class="cash" @click="getCash">提现</div>
  </div>
</template>
<script>
import { XHeader, Group, XInput, Toast } from "vux";
import { setTimeout } from "timers";
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
    getCash() {
      if(!this.total_fee || this.total_fee ==0){
        this.$vux.toast.show({
            text: "请输入提现金额",
            type:"cancel"
        });
        return
      }
      this.ajax({
        method: "post",
        url: "/app/wechat/pay/withdrawals",
        data: {
          total_fee: this.total_fee
        },
        success: res => {
          if (res.code == 0) {
            this.$vux.toast.show({
              text: "提现成功"
            });
            setTimeout(() => {
              this.$router.push({
                name: "wallet"
              });
            }, 500);
          }
        },
        fail: res => {
          if (res.code == 500) {
            this.$vux.toast.show({
              text: res.msg,
              type: "cancel"
            });
          }
        }
      });
    },
    onInput(value){
      console.log('value',value)
      if(value > this.balance){
        console.log('true',this.balance)
        this.total_fee = this.balance
      }
    }
  },
  data() {
    return {
      total_fee: "",
      balance: ""
    };
  }
};
</script>

<style lang="less" scoped>
.balance {
  // float:right;
  width: max-content;
  position: relative;
  left: 100%;
  transform: translateX(-100%);
  margin-top: 1rem;
  color: #848484;
  padding-right: 1rem;
}
.tie {
  padding: 0 1rem;
  span {
    color: #f8c301;
  }
  p {
    color: #c8c8c8;
  }
}
.cash {
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


