import Vue from 'vue'
import Router from 'vue-router'
// router 配置文件
import index from 'src/page/index/index.vue'
// import wallet from 'src/page/center/wallet.vue'
const config = {
  index: [{
	component: index,
	name: 'index',
	title: '山河特旅'
  }, {
	component: () => import('src/page/index/activity.vue'),
	name: 'activity',
	title: '活动',
	base: {
	  path: '/index/:activityType'
	}
  }, {
	component: () => import('src/page/index/activitydetail.vue'),
	name: 'activitydetail',
	title: '活动详情',
	base: {
	  path: '/index/:activityType/:activityId'
	}
  }, {
	component: () => import('src/page/index/allmessage.vue'),
	name: 'allmessage',
	title: '活动留言',
	base: {
	  path: '/index/:activityType/:activityId/allmessage'
	}
  }, {
	component: () => import('src/page/index/addmsg.vue'),
	name: 'addmsg',
	title: '发布留言',
	base: {
	  path: '/index/:activityType/:activityId/allmessage/addmsg'
	}
  }, {
	component: () => import('src/page/index/teaminfo.vue'),
	name: 'teaminfo',
	title: '团队榜',
	base: {
	  path: '/index/:activityType/:activityId/teaminfo'
	}
  }, {
	component: () => import('src/page/index/phone.vue'),
	name: 'phone',
	title: '绑定手机',
	base: {
	  path: '/phone'
	}
  }],
  sponsor: [{
	component: () => import('src/page/sponsor/sponsor.vue'),
	name: 'sponsor',
	title: '发起'
  }, {
	component: () => import('src/page/sponsor/edit.vue'),
	name: 'actionedit',
	title: '编辑支持活动详情'
  }, {
	component: () => import('src/page/sponsor/support.vue'),
	name: 'support',
	title: '设置支持方案'
  }, {
	component: () => import('src/page/sponsor/newMoney.vue'),
	name: 'newMoney',
	title: '设置支持方案'
  }, {
	component: () => import('src/page/sponsor/actionsuccess.vue'),
	name: 'actionsuccess',
	title: ''
  }],
  notice: [{
	component: () => import('src/page/notice/notice.vue'),
	name: 'notice',
	title: '通知'
  }],
  system: [{
	component: () => import('src/page/system/login.vue'),
	name: 'login',
	title: '登录'
  }, {
	component: () => import('src/page/system/nofound.vue'),
	name: 'nofound',
	title: '未找到页面',
	base: {path: '404'}
  }],
  center:[{
	component: () => import('src/page/center/index.vue'),
	name: 'centerIndex',
	title: '个人中心'
  }, {
	component: () => import('src/page/center/wallet.vue'),
	name: 'wallet',
	title: '我的钱包'
  }, {
	component: () => import('src/page/center/recharge.vue'),
	name: 'recharge',
	title: '充值'
  }, {
	component: () => import('src/page/center/cash.vue'),
	name: 'cash',
	title: '提现'
  }, {
	component: () => import('src/page/center/friend.vue'),
	name: 'friend',
	title: '我的好友'
  }, {
	component: () => import('src/page/center/partner.vue'),
	name: 'partner',
	title: '申请成为赛事合伙人'
  }, {
	component: () => import('src/page/center/update.vue'),
	name: 'update',
	title: '编辑资料'
  },{
	component: () => import('src/page/center/message.vue'),
	name: 'message',
	title: '我的留言'
  },{
	component: () => import('src/page/center/contact.vue'),
	name: 'contact',
	title: '联系我们'
  },{
	component: () => import('src/page/center/MyActivity.vue'),
	name: 'MyActivity',
	title: '报名活动'
  },{
	component: () => import('src/page/center/updateActivity.vue'),
	name: 'updateActivity',
	title: '编辑修改',
	base:{
	  path: '/center/:activityId'
	}
  }
  ]
}
// base router
let routes = []

for (let moduleName in config) {
  let module = config[moduleName]
  for (let i = 0; i < module.length; i++) {
	let page = module[i]
	let basePath = /index|system/.test(page.name) ? '' : '/' + moduleName
	let name = /index/.test(page.name) ? moduleName : page.name
	let path = basePath + '/' + name
	routes.push(Object.assign({
	  path,
	  name,
	  component: page.component,
	  meta: {
		pageTitle: page.title
	  }
	}, page.base || {}))
  }
}
routes.push({
  path: '/*',
  redirect: '/index'
})

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: '/main', // 部署的基础路径
  routes/*:[
	{
	  path: '/login',
	  name: 'login',
	  meta: {
		pageTitle: '登录'
	  },
	  component: login
	},
	{
	  path: '/404',
	  name: 'nofound',
	  component: nofound,
	  meta: {
		pageTitle: '404'
	  }
	},
	{
	  path: '/*', // 其他页面，强制跳转到登录页面
	  redirect: '/index'
	}
  ]*/
})
