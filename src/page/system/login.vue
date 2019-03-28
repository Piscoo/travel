<!-- 登录 -->
<template>
  <div id="login" class="_top">
    <div class="vux-demo">
      <h3></h3>
    </div>
    <form @submit.prevent="login($event)" ref="form">
      <group>
        <x-input required placeholder="请输入账号" type="text" is-type="china-mobile" name="phone" v-model="form.phone">
          <!-- <img slot="label" src="~assets/evan_icon/user-icon.png" width="20" height="" style="margin-right: .5em" @click="showTest=true"> -->
          <span slot="right" class="eva-tip">*</span>
        </x-input>
        <x-input required placeholder="请输入密码" type="password" :min="6" name="password" v-model="form.password">
          <!-- <img slot="label" src="~assets/evan_icon/lock-icon.png" width="22" height="" style="margin-right: .5em"> -->
          <span slot="right" class="eva-tip">*</span>
        </x-input>
      </group>
      <popup-picker
      :data="testList"
      @on-change="select"
      :show.sync="showTest"></popup-picker>
      <p class="row">
        <!-- <router-link to="/find" class="a-normal">忘记密码</router-link> -->
        <!-- <router-link to="/change" class="a-normal">更改密码</router-link> -->
      </p>
      <p class="row">
        <x-button class="login" action-type="submit">登录</x-button>
      </p>
    </form>
    <!-- <img src="~assets/index.jpg" alt="测试引入图片" /> -->
    <!-- <img :src="testImg" alt="测试引入图片" /> -->
  </div>
</template>

<script>
  import { Group, XInput, XButton, PopupPicker } from 'vux'
  export default {
    components: {
      Group,
      XInput,
      PopupPicker,
      XButton
    },
    methods: {
      login (e) {
        if (this.formValid()) {
          this.ajax({
            method: 'post',
            url: '/outer/login',
            data: JSON.stringify(this.form),
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            },
            success: (res) => {
              const code = res.code
              const message = res.message
              if (code === 0) {
                const data = res.data
                this.$vux.toast.text(message)
                this.$store.commit('updateUserMessage', { userMessage: data })
                const currentState = window.history.state
                this.$router.back()
                setTimeout( _ => {
                  const newCurrentState = window.history.state
                  if (currentState === newCurrentState) {
                    this.$router.replace('/index')
                  }
                }, 500)
              } else {
                this.$vux.toast.text(message)
              }
            }
          })
        }
      },
      select (v) {
        this.form.phone = this.form.password = v[0]
        this.login()
      }
    },
    data () {
      return {
        requires: ['phone', 'password'], // 必填校验
        // testImg: require('~assets/index.jpg'), // 测试引入图片
        form: {
          phone: '',
          password: ''
        },
        showTest: false,
        testList: [['13679735528', '13580350579']]
      }
    },
    beforeCreate () {
      this.$store.commit('updateTabbar', {tabbar: -1})
    }
  }
</script>

<style lang="less" scoped>
#login{
  /*background-image: url('~assets/index.jpg'); 测试引入图片*/
  background-color: #f1f2f3;
}
.login{
  border-radius: 1.2em;
  background-color: #ff502E;
  color: #fff;
}
.vux-demo {
  text-align: center;
  padding-top: 30px;
}
.logo {
  width: 70px;
  height: 70px
}
h3{
  color: #ec462f;
  letter-spacing: .2em;
}
</style>
