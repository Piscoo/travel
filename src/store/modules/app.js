export default {
  state: {
    tabbar: 0, // tabbar状态
    // pageTitle: 0, // 页面标题
    pageTitle: [], // 页面标题
    showBack: false, // 导航是否显示返回
    showTitleImg: false, // 导航是否显示喇叭图片
    isHeader: true, // 导航是否显示返回
    showMore: false, // 导航是否显示更多
    onClickMore () { return false }, // 更多事件
    onClickBack () { return false }, // 覆盖返回事件
    userNow: localStorage.getItem("userNow")||"", // 用户名
    token: localStorage.getItem("zcToken")||""
  },
  mutations: {
    updateTabbar (state, payload) {
      state.tabbar = payload.tabbar
    },
    updatePageTitle (state, payload) {
      state.pageTitle = payload.pageTitle
    },
    updateShowMore (state, payload) {
      state.showMore = payload.showMore
    },
    updateIsHeader (state, payload) {
      state.isHeader = payload.isHeader
    },
    updateShowBack (state, payload) {
      state.showBack = payload.showBack
    },
    updateShowTitleImg (state, payload) {
      state.showTitleImg = payload.showTitleImg
    },
    updateClickMore (state, payload) {
      state.onClickMore = payload ? payload.onClickMore : function () { return false }
    },
    updateClickBack (state, payload) {
      if (payload) {
        state.onClickBack = payload.onClickBack
      } else {
        state.onClickBack = function () { return false }
        state.onClickBack.goBack = true
      }
    },
    updateToken (state, payload) {
      state.token = payload.token
      localStorage.setItem('zcToken',payload.token)
    },
    updateUser (state, payload) {
      state.userNow = payload.userNow
      localStorage.setItem('userNow',payload.userNow)
    }
  }
}