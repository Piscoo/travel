# 众筹项目  Question & Answer
## 已解决问题
	1. 唤起手机数字面板安卓和IOS不同
		A:  andriod使用 type="number"   IOS使用 keyboard="number"
    2. 分享功能安卓不行(已解决)
    3.成为合伙人绑定手机之后分享出去的页面404(安卓和IOS)(phone.vue页面中的share)(已解决)
    4、账号系统紊乱，填写资料会出现另一个人名字，从新填写资料后，会覆盖前一个人的资料。大BUG；(已解决)
    5、绑定手机时如果众筹页面还在加载内容时，点击我要代言，会出现页面不跳转，但是页面标题已改变的情况；(已解决)
    6、报名后分享连接没有头像，分享人ID和内容介绍(已解决)
#### 19.01.10新问题  
    7、下单账号与支付账号不一致，请核实后再支付；
    8、加入某某战队后，个人分享出来的链接显示的都是这个战队设置的名称，没有显示个人的名字、(已完成)
    9、绑定手机后分享出来的链接没有介绍，只显示了www.shanhetelv.com(已完成)
    8、加入某某战队后，个人分享出来的链接显示的都是这个战队设置的名称，没有显示个人的名字、(已完成)
    10.众筹完成加水印  (已完成)
    11.确认一下要固定在底部的按钮是哪些按钮  (已完成)
    12.退款的活动的操作(已完成)
## 待测试问题
    4、7、9、10、11、12
## 未解决问题
## 知识点
### 微信分享
    1. 提供不带哈希的路径给后台请求签名（动态地址）
### 刷新页面
    1. 使用provide 和 inject
    2. 通过在app.vue 声明 reload方法分局定义的 isRouterAlive是 true/false 控制 router-view的隐藏或显示，实现页面再次加载
> app.vue
<pre>
    <router-view v-if="isRouterAlive"></router-view> 
    provide () {
        return {
          reload: this.reload
        }
    }
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick ( () => {
          this.isRouterAlive = true
        })
      }
    }
    data() {
      return {
        isRouterAlive: true
      }
    }
</pre>
> XXX.vue
<pre>
    inject: [ 'reload' ]    //注入依赖
    然后再需要的地方直接调用 this.reload() 方法
</pre>
## 页面跳转路由
  router.afterEach()  页面跳转时 location.href 任然为改变，还是上一个页面的路由，在router.afterEach()方法的 to 为当前页面的路径
  页面location.href与配置的路径可能不符合， 需要alert比对
  分享后链接会多参数 ?from= 需要执行 replace(/\?.*#/, '?#')
## 关注微信公众号
    https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=' + [公众号id] + '==&amp;scene=110#wechat_redirect

  前往关注公众号流程
   1、登陆时获取 openID
   2、需要判断是否关注公众号时调 /app/wechat/follow 接口  （参数：openID）
   3、返回字段  followed = 0 => 未关注  followed = 1 =>  已关注
   4、 未关注公众号的用户弹框提醒关注    
      目前只能使用二维码扫码关注，链接重定向关注按钮不显示

## 版本强制登录死循环

  某些设备localStorage跟url路径相关url变动会获取到不一致的localStorage

## IOS 复制链接功能失效  
    原因：微信内置浏览器对history的支持不够全面 对于开启了History Mode 的应用，只会保存第一条url
  
   解决办法： 每个页面刷新一次，不是简单的刷新，要用location.replace刷新
    在creater() 中拼接目标地址进行重定向，首次需要刷新才能够分享正确的页面，增加一个参数判断是否需要刷新页面，在页面销毁时清除缓存中的那个参数以便其他页面使用
    created() {
        var replace = window.location.href.split("#")[0] + "#" + window.location.href.split("#")[1]
        window.location.replace(replace)
        setTimeout(function() {
          if (!localStorage.getItem("loadagain")) {
             localStorage.setItem("loadagain", "yes")
             location.reload()
          }
        }, 50)
    },
    destroyed () {
        if (localStorage.getItem("loadagain")) {
            localStorage.removeItem("loadagain")
        }
    },
    目前配置了的页面有 首页，活动页，活动详情，通知，个人中心主页这几个主要页面
    在新页面created()中取缓存执行的比前一页面destroyed ()清除缓存快，所以加了50毫秒的延迟

## 打包到不同环境时的配置
    正式环境： config 中的 index.js中的  build:下的  assetsPublicPath: '/fundrais/',
    测试环境：config 中的 index.js中的   build:下的  assetsPublicPath: './',
