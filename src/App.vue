<template>
  <div id="app">
	<view-box ref="viewBox" :body-padding-top="isHeader ? '46px' : ''" :body-padding-bottom="tabbar !== -1 ? '55px' : '0px'">
	  <!-- <x-header v-show="isHeader" class="x-header" :left-options="{backText: '', showBack: showBack,preventGoBack: !onClickBack.goBack}" :title="pageTitle" :right-options="{showMore: typeof showMore === 'string' ? false : showMore}" @on-click-back="onClickBack" @on-click-more="onClickMore" slot="header"> -->
		<x-header v-show="isHeader" class="x-header" :left-options="{backText: '', showBack: showBack,preventGoBack: !onClickBack.goBack}" :right-options="{showMore: typeof showMore === 'string' ? false : showMore}" @on-click-back="onClickBack" @on-click-more="onClickMore" slot="header">
			<div class="newtitle" v-if="showTitleImg">
				<img class="titlepng" src="~assets/pisco/notice_white.png" alt="" v-if="showTitleImg" />
				<marquee>
		            <marquee-item v-for="i in pageTitle" :key="i">{{i}}</marquee-item>
		        </marquee>
			</div>
			<div class="newtitle" v-else>
				<img class="titlepng" src="~assets/pisco/notice_white.png" alt="" v-if="showTitleImg" />
				{{pageTitle}}
			</div>
			<span @click="onClickMore" class="header-btn" slot="right" v-if="typeof showMore === 'string'">{{showMore}}</span>
	  </x-header>
	  <transition @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')" :name="viewTransition" :css="!!direction">
		<router-view class="router-view" @backTop="test" v-if="isRouterAlive"></router-view>
	  </transition>
		<tabbar icon-class="what" class="tabbar" slot="bottom" v-show="tabbar !== -1">
			<tabbar-item :link="{name: 'index'}" :selected="tabbar === 0">
			  <img class="tab-icon" slot="icon" v-if="tabbar === 0" src="~assets/kiw/icon_tab bar_index_s @2x.png">
			  <img class="tab-icon" slot="icon" v-if="tabbar !== 0" src="~assets/kiw/icon_tab bar_index_us @2x.png">
			  <span slot="label">主页</span>
			</tabbar-item>
			<!-- <tabbar-item :link="{name: 'sponsor'}" :selected="tabbar === 1" @on-item-click="newAction">
			  <! <img class="tab-icon" slot="icon" v-if="tabbar === 1"  src="~assets/kiw/icon_tab bar_release_s@2x.png"> -->
			<!-- <img
				class="tab-icon"
				slot="icon"
				v-if="tabbar !== 1"
				src="~assets/kiw/icon_tab bar_release_us@2x.png"
			  >
			  <span slot="label">发起</span>
			</tabbar-item> -->
			<tabbar-item :link="{name: 'notice'}" :selected="tabbar === 2">
			  <img class="tab-icon" slot="icon" v-if="tabbar === 2" src="~assets/kiw/icon_tab bar_message_s@2x.png">
			  <img class="tab-icon" slot="icon" v-if="tabbar !== 2" src="~assets/kiw/icon_tab bar_message_us@2x.png">
			  <span slot="label">通知</span>
			</tabbar-item>
			<tabbar-item :link="{name: 'centerIndex'}" :selected="tabbar === 3">
			  <img class="tab-icon" slot="icon" v-if="tabbar === 3" src="~assets/kiw/icon_tab bar_mine_s@2x.png">
			  <img class="tab-icon" slot="icon" v-if="tabbar !== 3" src="~assets/kiw/icon_tab bar_mine_us@2x.png">
			  <span slot="label">我的</span>
			</tabbar-item>
		</tabbar>
	</view-box>
  </div>
</template>

<script>
	import { Tabbar, TabbarItem, ViewBox, XHeader, Marquee, MarqueeItem, Actionsheet } from "vux";
	import { mapState, mapActions } from "vuex";
	import { debug } from 'util';
	export default {
	    name: "app",
	    //使用provide 和 inject 控制页面刷新
	    provide () {
			return {
			    reload: this.reload
			}
	    },
	    components: {
			Tabbar,
			TabbarItem,
			ViewBox,
			XHeader,
			Marquee,
			MarqueeItem,
			Actionsheet
	    },
	    computed: mapState({
			route: state => state.route,
			path: state => state.route.path,
			tabbar: state => state.app.tabbar, // -1 不显示 0 1 2 3 对应项目active
			isHeader: state => state.app.isHeader, // false 不显示 true 显示
			pageTitle: state => state.app.pageTitle || "",
			showTitleImg: state => state.app.showTitleImg,
			showBack: state => state.app.showBack,
			showMore: state => state.app.showMore,
			onClickMore: state => state.app.onClickMore,
			onClickBack: state => state.app.onClickBack,
			// deviceready: state => state.vux.deviceready,
			demoTop: state => state.vux.demoScrollTop,
			isLoading: state => state.vux.isLoading,
			direction: state => state.vux.direction,
			viewTransition() {
			    return !this.direction ? "" : "vux-pop-" + (this.direction === "forward" ? "in" : "out");
			},
			beforeDestroy() {
			    this.box && this.box.removeEventListener("scroll", this.handler, false);
			},
	    }),
	    methods: {
			...mapActions(["updatePosition"]),
			test() {
			    this.$refs.viewBox.scrollTo(0);
			},
			newAction() {
			  // localStorage.removeItem("sponsorForm")
			  // localStorage.removeItem("editForm")
			  // localStorage.removeItem("supportForm")
			},
			reload () {
			    this.isRouterAlive = false
			    this.$nextTick ( () => {
					this.isRouterAlive = true
			    })
			}
	    },
	    mounted() {
			this.$router.afterEach(this.test)
			this.share({
			  title : this.$route.pageTitle || '山河特旅',
			  // link : location.href,
			  link : 'http://' + location.host + '/fundrais/index.html?' + location.hash,
			  imgUrl : 'http://' + location.host + '/fundrais/static/img/logo@2x.0659ca3.png',
			  desc: this.$route.pageTitle || '山河特旅'
			})
	    },
	    data() {
			return {
			    isRouterAlive: true
			};
	    }
	};
</script>

<style lang="less">
	@import "~vux/src/styles/close.less";
	@import "~vux/src/styles/reset.less";
	@import "~vux/src/styles/1px.less";
	@import "~src/styles/main.less";
</style>

<style scoped lang="less">
	#app {
	  height: 100%;
	  /* hack */
	  /deep/.xbutton {
		position: fixed;
		left: auto;
		right: 20px;
		bottom: 30px;
	  }
	  /deep/ .vux-header .vux-header-left .left-arrow:before {
		border-color: #fff;
	  }
	  /deep/ .vux-header-title {
		color: #fff;
	  }
	  /deep/ .weui-tabbar__icon {
		width: auto;
		// height: 27px;
		height: 2.08rem;
		display: flex;
		align-items: center;
		justify-content: center;
	  }
	}

	.x-header {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 100;
		// height: 3.67rem;
		background-color: #f8c301;
	}
	.newtitle {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.vux-header-title {
		vertical-align: middle;
		line-height: 46px;
	}

	.titlepng {
		width: 36px;
		height: 36px;
	}

	.router-view {}

	.tabbar {}

	.tabbar img {
	  width: auto;
	  height: 2.08rem;
	}

	.header-btn {
		display: inline-block;
		color: #fff;
		padding-left: 1em;
		font-size: 1.25rem;
	}
	a {
		color: #000;
	}	
</style>
