// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import store from './store'
// import FastClick from 'fastclick'
import App from './App'
import vuexI18n from 'vuex-i18n'
import objectAssign from 'object-assign'
import { sync } from 'vuex-router-sync'
import { throttle, debounce, cookie, ConfigPlugin, BusPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin, ToastPlugin, WechatPlugin, AjaxPlugin, dateFormat, DatetimePlugin } from 'vux'
// import { debug } from 'util'
var vuxLocales = require('./locales/global_locales.yml')
var infiniteScroll =  require('vue-infinite-scroll')

const ipaddr = "http://www.shanhetelv.com/fundrais/"
// const ipaddr = "http://192.168.1.119:8080/social/"

// 全局变量声明
window.$ = {}
window.$.cookie = cookie
typeof window.Object.assign !== 'function' && (window.Object.assign = objectAssign) // objectAssign 兼容

// 注册vue插件
// FastClick.attach(document.body)
// 滚动加载更多
Vue.use(infiniteScroll)
// 多语言配置
Vue.use(vuexI18n.plugin, store)
const finalLocales = {
	'en': objectAssign(vuxLocales['en']),
	'zh-CN': objectAssign(vuxLocales['zh-CN'])
}

for (let i in finalLocales) {
	Vue.i18n.add(i, finalLocales[i])
}
Vue.i18n.set('zh-cn')
// global VUX config
Vue.use(ConfigPlugin, {
	$layout: 'VIEW_BOX' // global config for VUX, since v2.5.12
})
Vue.use(BusPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)
Vue.use(AjaxPlugin)
Vue.use(DatetimePlugin)

Vue.prototype.dateFormat = dateFormat
/**
 * 唤起微信支付
 * @param  {[object]} config  [签名]
 * @param  {[function]} success [支付成功]
 * @param  {[function]} error   [支付失败]
 * @return {[type]}         [description]
 */
Vue.prototype.$callWxPay = function (config, success, error) {
	let wxPay = function () {
		WeixinJSBridge.invoke(
			"getBrandWCPayRequest", {
				appId: config.appId,
				timeStamp: config.timeStamp,
				nonceStr: config.nonceStr,
				package: config.package,
				signType: config.signType,
				paySign: config.sign
			}, res => {
				if (res.err_msg == "get_brand_wcpay_request:ok") {
					success && success(res.err_msg == "get_brand_wcpay_request:ok", res)
				} else {
					error && error(res)
				}
			}
		)
	}
	if (typeof WeixinJSBridge === "undefined") {
		if (document.addEventListener) {
			document.addEventListener("WeixinJSBridgeReady", wxPay, false);
		} else if (document.attachEvent) {
			document.attachEvent("WeixinJSBridgeReady", wxPay)
			document.attachEvent("onWeixinJSBridgeReady", wxPay)
		}
	} else {
		wxPay()
	}
}

// const confirm = Vue.$vux.confirm   // 确认弹层
const toast = Vue.$vux.toast          // 吐司
const qs = require('qs')              // 序列化数据
// https://github.com/axios/axios 官方文档
const baseAxiosConfig = {
	baseURL: ipaddr,
	method: 'get',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json;charset=UTF-8',
		'Access-Control-Allow-Origin': '*'
	},
	paramsSerializer: function (params) {     // 数据格式化
		return qs.stringify(params, { arrayFormat: 'brackets' })
	},
	transformRequest: [function (data, config) {      // 数据格式化
		var ContentType = config['Content-Type']
		if (typeof data === 'string' || data instanceof FormData) {
			return data
		} else if (/form/i.test(ContentType)) {
			return qs.stringify(data)
			return (typeof data === 'string' || data instanceof FormData) ? data : qs.stringify(data)
		} else {
			return JSON.stringify(data)
		}
	}]
}
let restLogin = function (force = false) {
	// alert('重登录')
	if (/debugger/.test(location.href)) {
		var debuggerToken = location.href.replace(/.*debugger_+(.+)#.*/, '$1').replace(location.href) || localStorage.getItem('zcToken')
		localStorage.setItem('zcToken', debuggerToken)
		httpOne.defaults.headers.common['token'] = debuggerToken
	}
	if (!force) { // 非必要登录
		return
	}
	if (restLogin.start) { // 重登录锁
		return
	}
	restLogin.start = true

	window.getWechatCode()
}

const request = function (config) {         // axios 请求拦截器
	return config
}
const requiresError = function (error) {    // axios 请求错误
	return Promise.reject(error)
}
const interceptors = function (response) {  // axios 返回拦截器
	switch (response.data.code) {
		case 0:
			return response
		case 401:
			if (!/login/.test(response.config.url)) {
				restLogin(true)
				throw response
			}
			toast.text(response.data.msg)
			throw response.data
		default:
			toast.text(response.data.msg || '系统异常！')
			throw response.data
	}
}
const responseError = function (error) {    // axios 返回错误
	return Promise.reject(error)
}

const http = Vue.http // axios默认配置
http.interceptors.request.use(request, requiresError)       // Add a request interceptor
http.interceptors.response.use(interceptors, responseError) // Add a response interceptor

const httpOne = Vue.http.create(baseAxiosConfig)            // http配置
httpOne.interceptors.request.use(request, requiresError)
httpOne.interceptors.response.use(interceptors, responseError)

// httpOne.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
/**
 * 授权登录
 * @return {[type]} [description]
 */
var login = function () {
	// alert('服务器登录!')
	window.logining = true;
	let code = window.ZcCode
	httpOne.post(ipaddr + '/app/wechat/login', { code: code}, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
		.then(res => {
			const zcToken = res.data.data.token
			let replaceUrl = localStorage.getItem('replaceUrl')
			localStorage.removeItem('replaceUrl')

			// httpOne.defaults.headers.common['token'] = zcToken
			window.localStorage.setItem('zcToken', zcToken)
			window.localStorage.setItem('version', window.versionnow) // 获取到token更新版本号
			window.location.replace(replaceUrl)
			/*store.commit("updateToken", { token: zcToken })
			if(!/#\/index$/.test(ZcHash)){
				router.push({path:ZcHash.replace("#","")})
				return
			}
			if (window.$.ajax.loginCallback.length) {
				for (var i = 0; i < window.$.ajax.loginCallback.length; i++) {
					window.$.ajax.loginCallback[i]()
				}
				window.$.ajax.loginCallback = []
			}*/
		}).catch(error => {
			// console.log(error)
			Vue.$vux.loading.show({
				text: '服务器登录失败！'
			})
		})
}

// {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}
if (window.ZcCode) { // code换token
	login()
} else if(localStorage.getItem("zcToken")) { // token使用
	httpOne.defaults.headers.common['token'] = localStorage.getItem("zcToken");
	store.commit("updateToken", { token: localStorage.getItem("zcToken").replace('undefined', '') });
} else { // 获取调试token
	restLogin()
}

/**
 * 异步封装
 * @param  {[object]} option [异步参数]
 * @return {[type]}        [description]
 */
Vue.prototype.ajax = window.$.ajax = function (option) { // 异步配置
	if(window.$.ajax.url  === option.url){
	return
	}
	if(/patch|post/i.test(option.method)){
	window.$.ajax.url = option.url;
	}
	const userMessage = store.state.vux.userMessage || {}
	const method = option.method || 'get'
	const config = {
		method,
		url: option.url,
		[/get/i.test(method) ? 'params' : 'data']: option.data,
		headers: Object.assign({
			'accessToken': userMessage.token || 'evan'
		}, option.headers)
	}
	const ajaxNext = response => {
		Vue.$vux.loading.hide()
		if (!response) {
			return
		} else if (/<!DOCTYPE html>/.test(response.data)) {
			console.error('服务器异常！', response.config.url)
			typeof option.fail === 'function' && option.fail(error)
		} else {
			typeof option.callBack === 'function' && option.callBack(response)
			typeof option.success === 'function' && option.success(response.data)
		}
		window.$.ajax.url = null;
		typeof option.complete === 'function' && option.complete(response)
		store.commit('updateLoadingStatus', { isLoading: true })
	}
	const ajaxError = error => {
		Vue.$vux.loading.hide()
		console.log('error',error)
		if (error.message === 'Network Error') {
			// restLogin()
			toast.text('网络请求失败！')
		} else if (/404/.test(error.message)) {
			toast.text('未找到接口！')
		} else if (/500/.test(error.message)) {
			toast.text('服务器异常！')
		}
		typeof option.fail === 'function' && option.fail(error)
		window.$.ajax.url = null;
		typeof option.complete === 'function' && option.complete(error)
		store.commit('updateLoadingStatus', { isLoading: true })
	}
	typeof option.before === 'function' && option.before()
	store.commit('updateLoadingStatus', { isLoading: false })
	Vue.$vux.loading.show({
	text: '加载中'
	})
	// 第一次分享失效
	if (httpOne.defaults.headers.common['token'] || /\/app\/wechat\/share/.test(option.url)) {
		httpOne(config).then(ajaxNext).catch(ajaxError)
	} else {
		Vue.$vux.loading.hide()
		console.log('debugger-no-token!')
		window.$.ajax.loginCallback.push(function(){
			httpOne(config).then(ajaxNext).catch(ajaxError)
		})
	}
}
// 等待登陆的回调
window.$.ajax.loginCallback = []
/**
 * 微信分享
 * @param  {Object} options [分享配置参数]
 * @return {[type]}         [description]
 */
var share = Vue.prototype.share = function (options = {}) {
	var config = Object.assign({title: '', link: '', imgUrl: '', desc: '', success: function() {}}, options)
	config.link = config.link.replace('?/', '?')
	var shareConfigLink = config.link.split('#')[0]
	var shareFun = function () {  //需在用户可能点击分享按钮前就先调用
		var ua = navigator.userAgent
		var userNow = localStorage.getItem("userNow")
    if (/Android/i.test(ua)) { // android
    }
    if (/iPhone/i.test(ua)) { // ios
    }
		// 1.4 版本以上jssdk Vue.wechat.updateAppMessageShareData(config)
		Vue.wechat.onMenuShareAppMessage(config)
		// delete config.desc
		// 1.4 版本以上jssdk Vue.wechat.updateTimelineShareData(config)
		Vue.wechat.onMenuShareTimeline({
			title: userNow ? ` ${userNow} 参加了${config.title}` : config.title, // 分享标题
		    link: config.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: config.imgUrl, // 分享图标
		    success: function () {}// 用户点击了分享后执行的回调函数
		})
	}
	if (share.configurl !== shareConfigLink) {
		// 签名路径与分享路径不同
		// alert(share.configurl + '~~' + shareConfigLink)
		share.config(shareConfigLink)
		share.callBack = shareFun
	}else if (share.ready) {
		// 签名未就绪
		Vue.wechat.ready(shareFun)
	} else {
		// 配置分享
		share.callBack = shareFun
	}
}
share.configurl = location.href.split('#')[0]
// 获取微信分享签名
share.config = function (url) {
	window.$.ajax({
		url: '/app/wechat/share',
		method: 'get',
		data: {
			url: url
		},
		success: res => {
			const data = res.data
			Vue.wechat.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: 'wx17d9680c7613a989',
				timestamp: data.timestamp,
				nonceStr: data.nonceStr,
				signature: data.signature,
				jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 1.4 版本以上
				jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 兼容测试
			})
			Vue.wechat.error(function(res){
			  // alert('jssdk签名失败:' + res.errMsg + '本地路径' + location.href)
			})
			if (!share.ready) {
				share.ready = true
				share.callBack && Vue.wechat.ready(share.callBack)
			}
		}
	})
}
share.config(share.configurl)

/**
 * [formValid vux表单检查扩展 未通过vux校验规则的情况或必填为空 返回false] vm 表示实例化的vue节点
 * 必填检查 在实例的vue中配置 单表达必填数组为 vm.data.requires 多表单为 vm.data.requires[key]
 *   必填检查格式为 [key|next] 或 [key]
 *     无next会focus到错误节点【请对无法focuse的元素配置next】
 *     next以'!'结束 调用toast(next) 反之执行的方法 vm[next](errorKey)
 * 表单数据 在data[key] 中 不存在无法检测 返回false
 * @param  {[string]} key [ref名称、data，默认为 form]
 * @return {[boolean]}     [是否通过验证]
 */
Vue.prototype.formValid = function (key = 'form') {
	const requires = typeof this.requires === 'object' ? this.requires[key] || this.requires : []

	if (typeof key !== 'string') {
	console.error('formValid error: parmam must be string or null!')
	return false
	}

	const formElement = this.$refs[key] // 表单元素
	const data = this[key] // 表单数据

	if (formElement === undefined) {
	console.error(`formValid error: element ref="${key}" not found!`)
	return false
	}
	if (data === undefined) {
	console.error(`formValid error: data.${key} not found!`)
	return false
	}

	const warns = formElement.getElementsByClassName('weui-cell_warn')

	if (warns.length) { // vux验证规则未通过
	warns[0].getElementsByClassName('weui_icon_warn')[0].click()
	warns[0].getElementsByClassName('weui_icon_warn')[0].click()
	warns[0].getElementsByTagName('input')[0].focus()
	return false
	}
	for (var i = 0; i < requires.length; i++) { // 必填校验
	const require = requires[i]
	const requireKey = require.replace(/\|.*/, '')
	const next = require.replace(/[^|]*\||[^|]*$/, '')

	if (!data[requireKey] && (typeof data[requireKey] !== 'number') || ((typeof data[requireKey] === 'object') && (data[requireKey].length === 0))) {
		if (next) {
		next.indexOf('!') === -1
			? this[next] && this[next](requireKey)
			: toast.text(next)
		} else {
		formElement[require]
			? formElement[require].focus()
			: console.error(`formValid error: Element ${require} not found!`)
		}
		return false
	}
	}
	return true
}

/**
 *以下3个可以从vuex取得并使用
 *store.state.route.path   // current path (string)
 *store.state.route.params // current params (object)
 *store.state.route.query  // current query (object)
 */
sync(store, router)

// simple history management
const history = window.sessionStorage
history.clear()
history.setItem('/index', 0)
let historyCount = history.getItem('count') * 1 || 0
let isPush = false
let endTime = Date.now()
let methods = ['push', 'go', 'replace', 'forward', 'back']

methods.forEach(key => {
	let method = router[key].bind(router)
	router[key] = function (...args) {
		isPush = true
		method.apply(null, args)
	}
})
document.addEventListener('touchend', () => {
	endTime = Date.now()
})

router.beforeEach(function (to, from, next) { // 路由跳转前
	const path = to.path
	const isBack = /\/.*\/.*/
	const toIndex = history.getItem(to.path)
	const fromIndex = history.getItem(from.path)

	// 设置页面title
	// const normal = to.meta.pageTitle || ''
	// document.title = normal
	Vue.$vux.loading.hide()
	store.commit('updateLoadingStatus', { isLoading: true })
	if (store.state.app.showMore) { // 去除更多
		store.commit('updateShowMore', { showMore: false })
		store.commit('updateClickMore')
	}
	// // 初始化状态
	// store.commit('updatePageTitle', { pageTitle: normal })
	store.commit('updateTabbar', { tabbar: -1 }) // 不显示tabbar
	store.commit('updateIsHeader', { isHeader: true }) // 显示头部
	store.commit('updateShowBack', { showBack: isBack.test(path) }) // 导航是否显示返回
	if (isBack.test(path)) {
		store.commit('updateClickBack', {
			onClickBack: function () { // history back 失效跳转首页 【返回按钮默认事件】
				const currentState = window.history.state
				router.back()
				setTimeout(function () {
					if (currentState === window.history.state) {
						router.replace('/index')
					}
				}, 500)
			}
		})
	}

	if (toIndex) {
		if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
			store.commit('updateDirection', { direction: 'forward' })
		} else {
			// 判断是否是ios左滑返回
			if (!isPush && (Date.now() - endTime) < 377) {
				store.commit('updateDirection', { direction: '' })
			} else {
				store.commit('updateDirection', { direction: 'reverse' })
			}
		}
	} else {
		++historyCount
		history.setItem('count', historyCount)
		to.path !== '/index' && history.setItem(to.path, historyCount)
		store.commit('updateDirection', { direction: 'forward' })
	}
	router.evaTime = Date.now()
	if (/\/http/.test(to.path)) {
		let url = to.path.split('http')[1]
		window.location.href = `http${url}`
	} else {
		next()
	}
})

router.afterEach(function (to) { // 路由跳转完成后
	isPush = false
	const load = Date.now() - router.evaTime
	// 设置页面title
	const normal = to.meta.pageTitle || ''
	document.title = normal
	// 初始化状态
	store.commit('updatePageTitle', { pageTitle: normal })
	share({
		title : to.meta.pageTitle || '山河特旅',
		link : 'http://' + location.host + '/fundrais/index.html' + '?/#' + to.fullPath,
		imgUrl : 'http://' + location.host + '/fundrais/static/img/logo@2x.0659ca3.png',
		desc: to.meta.pageTitle || '山河特旅'
	})
	if (load < 233) {
		setTimeout(() => { store.commit('updateLoadingStatus', { isLoading: false }) }, 233 - load)
	} else {
		store.commit('updateLoadingStatus', { isLoading: false })
	}
})


/* eslint-disable no-new */
new Vue({
	directives: {infiniteScroll},
	store,
	router,
	render: h => h(App)
}).$mount('#app-box')
