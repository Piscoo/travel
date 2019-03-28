<template>
  <div id="main">
  </div>
</template>
<script>
  import { } from 'vux'
  export default {
    components: {
    },
    methods: {
    },
    beforeCreate() {
      this.$store.commit('updateTabbar', {tabbar: -1}) // -1 无 0～3 tabbar对应下标
      this.$nextTick(function() { // vue 渲染就绪函数
      })
    },
    data () {
      return {
      }
    }
  }
</script>
<i18n>
</i18n>
<style lang="less">
#main{}
</style>
