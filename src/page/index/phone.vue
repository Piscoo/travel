<template>
  <div>
    <div v-show="!binded">
      <div class="title">绑定手机</div>
      <form ref="form">
        <group class="baseInfo" gutter="0">
          <x-input title="姓名:" :max="5" v-model="form.userName" name="userName" placeholder="请填写真实姓名" :disabled="disabled" required></x-input>
          <x-input title="手机号:" v-model="form.phone" type="number" placeholder="请填写手机号" :disabled="disabled" is-type="china-mobile" name="phone" required>
            <span slot="right" @click="getVerificationCode">{{VerificationCodeTie}}</span>
          </x-input>
          <x-input title="验证码:" v-model="form.verificationCode" placeholder="请填写验证码" @on-blur="sendVerificationCode" type="number" keyboard="number" :disabled="disabled" name="verificationCode" :is-type="checkVerificationCode" required>
            <!-- -->
            <span slot="right" :style="{'color':verificationCode==1 ? 'green':'red'}" v-if="verificationCode==1 || verificationCode==2">验证{{verificationCodeText}}！</span>
          </x-input>
          <x-textarea title="代言宣言:" :max="50" placeholder="请输入代言宣言" name="supportDecl" v-model="form.supportDecl" required></x-textarea>
        </group>
      </form>
      <div class="bind" @click="toBinding" :class="locking ? 'locked': '' ">注册绑定</div>
    </div>
    <div v-show="binded" class="share">
      <div class="activityName">{{detailInfo.title}}</div>
      <div class="dec">代言宣言：{{form.supportDecl || detailInfo.supportDecl}}</div>
      <div class="sharebtn" @click="toShare">分享给朋友</div>
    </div>
    <div v-show="showShare" class="sharebox" @click="hideShare">
      <div class="arrow"><img src="~assets/pisco/up.png" alt=""></div>
      <div>点击<span class="timeline">"分享到朋友圈"</span></div>
      <div class="rightnow"><span class="line"></span>马上开始众筹!<span class="line"></span></div>
    </div>
  </div>
</template>

<script>
import { Group, XInput, Selector, PopupPicker, Toast, XTextarea } from "vux";
import { log } from "util";
import { setInterval, clearTimeout } from "timers";
export default {
  name: "phone",
  components: {
    Group,
    XInput,
    Selector,
    PopupPicker,
    Toast,
    XTextarea
  },
  beforeCreate() {
    this.$store.commit("updateShowBack", {
      showBack: true
    });
    this.$nextTick(() => {
        let activityId = this.$route.params.activityId
        this.activityId = activityId
        this.getActivityDetail()
        this.getUserInfo()
      })
      // this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
  },
  watch: {
    verificationCode: {
      handler(val) {
        this.verificationCodeText = val == 1 ? "成功" : "失败";
      },
      deep: true
    }
  },
  methods: {
    //注册并绑定
    toBinding() {
      this.locking = true
      if (this.verificationCode == -1) {
        this.sendVerificationCode.next = true;
      } else if (this.verificationCode !== 1) {
        return this.$vux.toast.show({
          text: "验证码错误",
          type: "cancel"
        });
      }
      // if (!this.form.supportDecl) {
      //   this.form.supportDecl = '我是' + this.user + '，我为此项目代言，请支持我！'
      // }
      if (this.formValid()) {
        var formData = new FormData()
        formData.append("activityId", this.activityId)
        formData.append("userName", this.form.userName)
        formData.append("phone", this.form.phone)
        formData.append("supportDecl", this.form.supportDecl)
        this.ajax({
          method: "post",
          url: "/app/user/activities/" + this.activityId + "/binding-spokesman",
          data: formData,
          success: res => {
            console.log(res)
            if (res.code == 0) {
              this.binded = true
              this.$store.commit('updatePageTitle', { pageTitle: "分享活动" })
              // 绑定成功之后重新调取数据填充分享的内容
              this.getActivityDetail()
            }
          },
          complete: res => {
            this.locking = false
          },
          fail: res => {
            this.$vux.toast.show({
              width: "10em",
              text: res.msg,
              type: "cancel"
            });
          }
        });
      }
    },
    //获取验证码
    getVerificationCode() {
      if (!/^\d{11}$/.test(this.form.phone)) {
        return this.$vux.toast.show({
          text: "请输入正确的手机号码",
          type: "cancel"
        });;
      }
      this.VerificationCodeTie = "发送中...";
      this.countDownNumber = 60;
      this.ajax({
        method: "post",
        url: "/app/user/sendsms",
        data: {
          phoneNumber: this.form.phone,
          nationCode: "86"
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: res => {
          this.countDown();
        }
      });
    },
    //验证填写的验证码
    sendVerificationCode() {
      if (/^\d{6}$/.test(this.form.verificationCode) && /^\d{11}$/.test(this.form.phone)) {
        this.ajax({
          method: "post",
          url: "/app/user/verifysms",
          data: {
            verificationCode: this.form.verificationCode
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: res => {
            if (res.code == 0) {
              this.verificationCode = 1;
              if (this.sendVerificationCode.next) {
                this.sendVerificationCode.next = null
              }
            } else {
              this.verificationCode = 2;
            }
          },
          fail: res => {
            this.verificationCode = 2;
          }
        });
      } else {
        return;
      }
    },
    // 发送验证码后倒计时
    countDown() {
      var timer = setInterval(() => {
        this.countDownNumber--;
        this.clickEvent = 2;
        this.VerificationCodeTie = this.countDownNumber + "s";
        if (this.countDownNumber <= 0) {
          timer.close();
          this.clickEvent = 1;
          this.VerificationCodeTie = "重发验证码";
        }
      }, 1000);
    },
    //验证码6位检验
    checkVerificationCode(value) {
      if (/^\d{6}$/.test(value)) {
        return { valid: true }
      } else {
        return { valid: false, msg: "验证码不对" }
      }
    },
    //获取活动详情
    getActivityDetail() {
      this.ajax({
        method: "get",
        // data: { activityId: 307},
        // url: "/app/activities/307",
        url: "/app/activities/" + this.activityId,
        data: { activityId: this.activityId },
        success: res => {
          let detailInfo = res.data
          detailInfo.userVo = detailInfo.userVo || {}
          this.detailInfo = detailInfo
          if (detailInfo.userVo.userName) {
            this.$store.commit("updateUser", { userNow: detailInfo.userVo.userName });
          }
          const teamName = detailInfo.teamName ? `【${detailInfo.teamName}】` : ''
          this.teamName = teamName
          this.share({
            title: `${teamName} ${detailInfo.title}`,
            link: location.origin+'/fundrais/index.html?#/index/6/' + this.activityId,
            imgUrl: detailInfo.imgsPath || ('http://' + location.host + '/fundrais/static/img/logo@2x.0659ca3.png'),
            desc: detailInfo.userVo.userName ? `${detailInfo.userVo.userName}报名参加了${detailInfo.title}` : detailInfo.supportDecl
          })
        }
      });
    },
    getUserInfo() {
      this.ajax({
        method: 'get',
        url: '/app/user',
        success: res => {
          this.user = res.data.userName
        }
      })
    },
    //分享活动
    toShare() {
      this.showShare = true
    },
    hideShare() {
      this.showShare = false
    }
  },
  created() {
    this.$vux.toast.show({
      type: "text",
      text: "以上个人信息事关赛事的后期服务及保险购买，务必填写真实个人信息，一经确定个人无法更改，若需更改请联系组委会！",
      time: 3600,
      width: "20rem",
      position: "top"
    })
  },
  destroyed () {
     if (localStorage.getItem("userNow")) {
        localStorage.removeItem("userNow")
        // this.$store.commit("updateUser", { userNow: '' });
     }
  },
  data() {
    return {
      user: '',
      locking: false,
      teamName: '',
      showShare: false,
      verificationCode: -1,
      verifyResult: '',
      verificationCodeText: "",
      disabled: false,
      VerificationCodeTie: "发送验证码",
      countDownNumber: 60,
      clickEvent: 1,
      idNumLength: 18,
      activityId: "",
      binded: false,
      detailInfo: [],
      form: {
        userName: "",
        phone: "",
        verificationCode: "",
        supportDecl: ""
      },
      requires: [
          "userName",
          "phone",
          "verificationCode",
          "supportDecl"
        ] //必填字段
    };
  }
};
</script>

<style lang="less" scoped>
.baseInfo {
  background: #fff;
}

/deep/ .header-btn {
  font-size: 1.25rem;
  color: #000;
}

.title {
  width: 100%;
  height: 3.57rem;
  background: #eee;
  line-height: 3.57rem;
  border-radius: 5px;
  text-align: center;
  font-size: 18px;
  letter-spacing: 1px;
}

.bind {
  width: 96%;
  height: 3.57rem;
  background: #ff0000;
  color: #fff;
  line-height: 3.57rem;
  border-radius: 5px;
  text-align: center;
  margin: 0 auto;
  font-size: 18px;
  letter-spacing: 1px;
  &.locked {
    pointer-events: none;
  }
}

.share {
  padding: 1rem;
  .activityName {
    font-size: 18px;
    color: black;
    margin-top: 2rem;
  }
  .dec {
    font-size: 18px;
    color: #ccc;
    margin-top: 1rem;
  }
  .sharebtn {
    width: 96%;
    height: 3.5rem;
    border-radius: 8px;
    background: #558a10;
    color: #fff;
    font-size: 18px;
    letter-spacing: 1px;
    line-height: 3.5rem;
    text-align: center;
    margin: 2rem auto;
  }
}

.sharebox {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 18px;
  text-align: center;
  letter-spacing: 1px;
  .arrow {
    width: 100%;
    margin-top: 4rem;
    margin-left: -1rem;
    text-align: right;
    img {
      width: 7rem;
    }
  }
  .timeline {
    display: inline-block;
    background: #d8667a;
    padding: 0 5px;
  }
  .rightnow {
    margin-top: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .line {
      display: inline-block;
      width: 3rem;
      height: 1px;
      background: #fff;
      margin: 0 10px;
    }
  }
}
</style>
