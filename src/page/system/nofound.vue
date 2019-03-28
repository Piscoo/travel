<template>
  <div id="nofound">
    <div class="center">
      <p>404</p>
      <router-link replace to="/index">返回首页</router-link>
    </div>
  </div>
</template>
<script>
  import {  } from 'vux'
  export default {
    components: {  },
    methods: {},
    beforeCreate () {
      this.$store.commit('updateTabbar', { tabbar: -1 }) // -1 无 0～3 tabbar对应下标
      this.$nextTick(function() {}) // vue 渲染就绪函数
    },
    data () {
      return {}
    }
  }
</script>
<style lang="less" scoped>
#nofound {
  .center {
    width: 100%;
    margin-top: -40px;
    position: absolute;
    text-align: center;
    top: 50%;
    p {
      font-size: 40px;
    }
  }
}
</style>
