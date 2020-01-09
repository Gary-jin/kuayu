// 线上环境，提交线上需开启
// 秒省243
var bizId = dsBridge.call("receiveParams", 'bizId') || 243
// 本地调试环境，本地调试需开启bizId = 120
// var bizId = 120
var codeVersion = dsBridge.call("receiveParams", 'codeVersion');
var isShowBack = dsBridge.call('receiveParams', 'isShowBack');
var transactionPassword = dsBridge.call("receiveParams", 'transactionPassword'); // 交易密码 0为未设置
var isShowBackBtn;
if (isShowBack === '0') {
  isShowBackBtn = false
} else {
  isShowBackBtn = true
}
//返回后台配置的图片
var imgConfig={};
if(codeVersion >= 340){
  imgConfig = JSON.parse(dsBridge.call('receiveParams', 'imgConfig')) 
}
// 设置axios请求拦截器开始
axios.interceptors.request.use(
  config => {
      // 你需要在这里取到你设置好的token的值
      var token;
      if (dsBridge.hasNativeMethod('setPrefs')) {
        // 如果在app中
        // token = dsBridge.call("receiveParams", 'token');
        token ="eyJ1aWQiOjIyMjkyMiwidGltZXN0YW1wIjoxNTc3OTUyNjM4LCJzaWduIjoiNmE2Yjk3ZTQ1YTgzYmFmNjJmNDNjNTkzODYxZDZiYzUifQ=="
      } else {
        // 如果不在app中
        // token = utils.storage.get('token');
        token ="eyJ1aWQiOjIyMjkyMiwidGltZXN0YW1wIjoxNTc3OTUyNjM4LCJzaWduIjoiNmE2Yjk3ZTQ1YTgzYmFmNjJmNDNjNTkzODYxZDZiYzUifQ=="
      }
      if (token) {
          // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
          config.headers.token = token;
      }
      if(codeVersion){
          config.headers.codeVersion = codeVersion;
      }
      return config
  },
  error => {
      return Promise.reject(error)
  }
);
// 设置axios请求拦截器结束

var Http = {
    // 线上环境，提交线上需开启
     //HOST:'http://native.youquanyun.com',
    //HOST:'http://unative.bangyaosoft.cn',
    // 本地调试环境，本地调试需开启HOST:''
    HOST: window.location.origin,
    LINK: window.location.origin + bizId,
    API_URL:{
      'HOMEGOODSLIST': '/api/'+bizId+'/amoy/home/goods-list', // 商品列表

      'TAOBAOGOODSDETAIL': '/api/'+bizId+'/amoy/taobao/goods-detail', // 商品详情
      'TAOBAOGOODSITEM': '/api/'+bizId+'/amoy/taobao/goods-item', // 商品详情
      // 订单红包
      'USERCOLLECTION': '/api/'+bizId+'/amoy/user/collection', // 收藏商品
      'USERREDINFO': '/api/'+bizId+'/amoy/user/red-info', // 红包领取详情
      'USERRECEIVERED': '/api/'+bizId+'/amoy/user/receive-red', // 领取红包
      'USERREDDETAIL': '/api/'+bizId+'/amoy/user/red-detail', // 红包详情接口
      'USERGRABCOUPONLOG': '/api/'+bizId+'/amoy/user/grab-coupon-log', // 红包机会日志
      'USERREDRULE': '/api/'+bizId+'/amoy/user/red-rule', // 红包规则接口
      'USERREDLIST': '/api/'+bizId+'/amoy/user/red-list', // 红包页面接口
      // 信用卡
      'HOMECREDITINDEX': '/api/'+bizId+'/amoy/home/credit-index', // 信用卡首页
      'HOMECARDURL': '/api/'+bizId+'/amoy/home/card-url', // 获取卡片地址
      'HOMECARDLIST': '/api/'+bizId+'/amoy/home/card-list', // 卡片列表
      'HOMECARDDETAIL': '/api/'+bizId+'/amoy/home/card-detail', // 卡片详情
      'HOMECARDAPPLY': '/api/'+bizId+'/amoy/home/card-apply', // 申请卡片列表
      // 活动专题
      'APPSUBJECTSTYLE': '/api/'+bizId+'/amoy_v2/app/subject-style', // 专题样式
      'APPSUBJECTGOODS': '/api/'+bizId+'/amoy_v2/app/subject-goods', // 专题商品列表(大淘客榜单)
      'APPSUBJECTTYPE':'/api/'+bizId+'/amoy_v2/app/subject-type', // 专题商品类型
      'OPTIMUSID':'/api/'+bizId+'/amoy_v2/taobao/optimus-id', // 商品分类（擎天柱）
      'OPTIMUS':'/api/'+bizId+'/amoy_v2/taobao/optimus', //商品列表（擎天柱）
      // 新版专题活动接口
      'APPREPAIRDATA': '/api/'+bizId+'/amoy_v2/app/repair-data', // 专题样式
      'APPREPAIRSOURCE': '/api/'+bizId+'/amoy_v2/app/repair-source', // 专题样式
      // 商城订单
      'ORDERSHOP':'/api/'+bizId+'/mall/order/list', // 商城我的订单
      'ORDERGROUPSHOP':'/api/'+bizId+'/mall/order/team-list', // 商城团队订单
      //小店订单
      'OTOORDER':'/api/'+bizId+'/mall/order/oto-list', // 小店我的订单
      'OTOGROUPORDER':'/api/'+bizId+'/mall/order/oto-team-list', // 小店团队订单
      // 订单
      'QUXIAODINGDAN' :'/api/'+bizId+'/mall/order/remove', //取消订单
      'DELDINGDAN' :'/api/'+bizId+'/mall/order/delete', //删除订单
      'QUERENSHOUHUO' :'/api/'+bizId+'/mall/order/confirm-order?i=1', //确认收货
      // 淘礼金
      'TLJGOODSLIST' :'/api/'+bizId+'/amoy_v2/tlj/goods-list',// 商品列表
      'GETTLJ' :'/api/'+bizId+'/amoy_v2/tlj/get-tlj',// 获取领取链接
      'INVITE' :'/api/'+bizId+'/amoy/user/invite-poster', // 获取邀请海报
      'TLJGOODSACTIVITYCONFIG' :'/api/'+bizId+'/amoy_v2/tlj/activity-config',// 装修

  // 权益中心
      'RIGHTERINDEX' :'/api/'+bizId+'/amoy_v2/user/rights', //首页
      'OPTIONALGOODS' :'/api/'+bizId+'/amoy/opgoods/optional-goods', //好货优选
      'RIGHTERPAY' :'/api/'+bizId+'/amoy_v2/user/get-pay-rights', //现金升级/礼包升级详情
      'RIGHTERCASHPAY' :'/api/'+bizId+'/amoy_v2/user/pay-card', //现金升级
      'GETUSERINFO': '/api/'+bizId+'/amoy/user/user-info', // 获取用户信息
      'INFOMEDIAOTHER': '/api/'+bizId+'/amoy_v2/info/media-other', // 赚钱吧
      'INFOMEDIAAD': '/api/'+bizId+'/amoy_v2/info/media-ad', // 数据切换
      'INFOMEDIAADTOP': '/api/'+bizId+'/amoy_v2/info/media-ad-other', // 优质数据切换
      'INFOMEDIAADBOT': '/api/'+bizId+'/amoy_v2/info/media-app-other', // app数据切换
      'INFOMEDIARECORD': '/api/'+bizId+'/amoy_v2/info/media-record', // 记录推广

      

      

      // 专属邀请码
      'INVITELIST' :'/api/'+bizId+'/amoy_v2/invite/list', // 设置邀请码列表
      'INVITESETCODE' :'/api/'+bizId+'/amoy_v2/invite/set-code', // 设置邀请码列表
      'INVITEGETINFO' :'/api/'+bizId+'/amoy_v2/invite/get-info',
  //生活券
      'LIVINGCIRCLE' :'/api/'+bizId+'/amoy/home/living-circle',
      'TICKETSTATUS' :'/api/'+bizId+'/amoy_v2/info/ticket-status',

      
      //新人免单
      'FREEORDER' :'/api/'+bizId+'/amoy/home/freeorder',
      'FREEGET' :'/api/'+bizId+'/amoy/home/freeget',// 获取领取链接
      //共享影视
      'VIDEOPATH' :'/api/'+bizId+'/amoy/movie/video-path',// 获取解析路径
      'VIDEOLIST' :'/api/'+bizId+'/amoy/share-video/video-list', // 获取影视列表
      'POWERCHECK' :'/api/'+bizId+'/amoy/movie/power-check', 
      'UPCONDITIONS' :'/api/'+bizId+'/amoy/movie/up-conditions', 
      'VIDEOINFO' :'/api/'+bizId+'/amoy/share-video/video-info', 
      'VIDEOSEARCH' :'/api/'+bizId+'/amoy/share-video/video-search', 
      'MOVIECARDLIST' :'/api/'+bizId+'/amoy/movie/card-list',
      'MOVIEADDCARD' :'/api/'+bizId+'/amoy/movie/add-card',
      'MOVIEAGENTPAY' :'/api/'+bizId+'/amoy/movie/movie-agent-pay',
      'MOVIEKEYCHECK' :'/api/'+bizId+'/amoy/movie/key-check',
      //早起打卡
      'HOMEDKDO' :'/api/'+bizId+'/amoy/home/dk-do',
      'HOMEDAKA' :'/api/'+bizId+'/amoy/home/da-ka',
      'HOMEDKDETAIL' :'/api/'+bizId+'/amoy/home/dk-detail',
      'HOMEDKSHARE' :'/api/'+bizId+'/amoy/home/dk-share',
      'HOMEDAKAPAY' :'/api/'+bizId+'/amoy/home/daka-pay',
      'USERUSERINFO' :'/api/'+bizId+'amoy/user/user-info',
      'HOMEDKDETAIL' :'/api/'+bizId+'/amoy/home/dk-detail',
      'HOMEDKRULE' :'/api/'+bizId+'/amoy/home/dk-rule',
      // 拉新奖励
      'USERUSERNEW' :'/api/'+bizId+'/amoy/user/user-new',
      'USERLAXINSUN' :'/api/'+bizId+'/amoy/user/laxin-sum',
      'USERAWARDLIST' :'/api/'+bizId+'/amoy/user/award-list',
      'USERNEWUSERLIST' :'/api/'+bizId+'/amoy/user/new-user-list',
      //拉新活动
      'HOMENEWLIST' :'/api/'+bizId+'/amoy/home/newlist', // 活动说明
      'HOMENESHOW' :'/api/'+bizId+'/amoy/home/show', // 获取中奖信息
      'USERINVITE' :'/api/'+bizId+'/amoy/user/invite', // 原来的邀请海报接口，现已废弃
  // 拼团
      'GROUPINDEX' : '/api/'+bizId+'/mall/activity/collage',//拼团首页
      'GROUPGOODSLIST' : '/api/'+bizId+'/mall/activity/collage-goods-list',//拼团列表
      'GROUPGOODSDETAIL' : '/api/'+bizId+'/mall/index/goods-detail',//拼团详情
      'GROUPATTRLIST' : '/api/'+bizId+'/mall/index/attr-list',//商品尺寸选择
      'GROUPCARDINTERIM' : '/api/'+bizId+'/mall/cart/interim',//商品尺寸选择
      'GROUPRULE' : '/api/'+bizId+'/mall/activity/collage-rule',//拼团规则
      'MYGROUPLIST' : '/api/'+bizId+'/mall/activity/collage-order-list',//我的拼团列表
      'MYGROUPDETAILS' : '/api/'+bizId+'/mall/activity/collage-order-detail',//我的拼团详情
      'GROUPORDERDELET' : '/api/'+bizId+'/mall/order/delete',//删除订单
       // 砍价
       'BARGAIN' :'/api/'+bizId+'/mall/activity/bargaining',//砍价列表banner
       'BARGAINLIST' :'/api/'+bizId+'/mall/activity/bargaining-goods-list', //砍价列表
       'BARGAINCREATE' :'/api/'+bizId+'/mall/activity/bargaining-create', //创建砍价订单
       'BARGAININFOCREATE' :'/api/'+bizId+'/mall/activity/bargaining-info', //创建砍价订单
       // 地址
       'ADDRESSLIST' :'/api/'+bizId+'/mall/users/address-list',//地址列表
       'ADDRESSDEFAULT' :'/api/'+bizId+'/mall/users/address-default',//地址设为默认
       'EXPRESSAGE' :'/api/'+bizId+'/mall/order/express-info',//快递
       //双十一红包
      'TAOBAOCHAOJI' :'/api/'+bizId+'/amoy_v2/taobao/chaoji',

        /**优惠券卡密相关 */
        'COUPONPASSGETLOG' :'/api/'+bizId+'/amoy/couponpass/get-log', /**优惠券领取记录 */ 
        'COUPONPASSEXCHANGEINFO' :'/api/'+bizId+'/amoy/couponpass/exchange-info',/**获取卡密余额信息*/ 
        'COUPONPASSCOUPONPASSLIST' :'/api/'+bizId+'/amoy/couponpass/couponpass-list', /**兑换记录 */ 
        'COUPONPASSEXCHANGEPASS' :'/api/'+bizId+'/amoy/couponpass/exchange-pass',/**兑换卡密*/
    // 商城
      'MALLCOMMENT' : '/api/'+bizId+'/mall/index/goods-discuss',//评论
      'MALLSHOPGOODS' : '/api/'+bizId+'/mall/index/goods-list',//店铺商品列表
      'MALLADDCART' : '/api/'+bizId+'/mall/cart/add',//加入购物车
      'MALLSCGOODS' : '/api/'+bizId+'/mall/users/goods-like',//商品收藏
      'MALLGETCOUPON' : '/api/'+bizId+'/mall/oto/get-coupon',//领取优惠券
      'MALLSHOPINDEX' : '/api/'+bizId+'/mall/shops/shop-info',//店铺首页
      'MALLSHOPGOODS' : '/api/'+bizId+'/mall/index/goods-list',//店铺商品
      'MALLSHOPCARE' : '/api/'+bizId+'/mall/users/shops-care',//关注店铺
      'MALLMYCOUPON' : '/api/'+bizId+'/mall/users/coupon-list',//我的优惠券
      'MALLMYGETCOUPON' : '/api/'+bizId+'/mall/cart/get-coupon',//我领取的优惠券
      'MALLQRCODEGOODS' : '/api/'+bizId+'/mall/qrcode/goods',//商品海报
      'MALLQRCODESHOP' : '/api/'+bizId+'/mall/qrcode/shops',//店铺海报
      //商城2
      'STORESHOPINFO' : '/api/'+bizId+'/mall/sadmin/shop-info',//商家基本信息
      'STORESHOPTIME' : '/api/'+bizId+'/mall/sadmin/shop-time',//更改营业时间
      'USERPEOPLE' : '/api/'+bizId+'/mall/sadmin/user-list',//核销人员管理
      'USERVIPCARD' : '/api/'+bizId+'/mall/sadmin/card-list',//会员卡管理
      'SZMXPROFIT' : '/api/'+bizId+'/mall/sadmin/profit',//收支明细
      'SZMXPXIDEROFIT' : '/api/'+bizId+'/mall/sadmin/flowing-water',//收支详细明细
      'OTOQRCODESECC' : '/api/'+bizId+'/mall/qrcode/qrcode',//线下商城-- 线下商家二维码扫描成功之后
      'ORDERDISTED' : '/api/'+bizId+'/mall/sadmin/hx-order',//手输核销码
      'ARTICLELIST' : '/api/'+bizId+'/mall/sadmin/oto-list',//订单管理
      'QURRENDINGDAN' : '/api/'+bizId+'/mall/sadmin/bbc-order-detail',//确认订单 订单详情
  // 商家中心
      'SHOPINDEX' : '/api/'+bizId+'/mall/sadmin/display',//商家中心
      'SHOPGOODSMANAGE' : '/api/'+bizId+'/mall/sadmin/goods-list',//商品管理
      'SHOPDISCUSSMANAGE' : '/api/'+bizId+'/mall/sadmin/discuss-list',//评论管理
      'SHOPDWITHDRAW' : '/api/'+bizId+'/mall/sadmin/withdraw',//提现
      'SHOPQRCODE' : '/api/'+bizId+'/mall/qrcode/shops',//二维码
      //拓店推手
      'OTOPUSHHANDUSER' : '/api/'+bizId+'/mall/oto/pushhand-user', // 推手信息
      'OTOPUSHHAND' : '/api/'+bizId+'/mall/oto/pushhand', // 申请推手
      'OTOPUSHHANDREBATE' : '/api/'+bizId+'/mall/oto/pushhand-rebate', // 申请推手
      // 省市县代理
      'MALLAGENTAGENTS' : '/api/'+bizId+'/mall/agent/agents',//省市县代理佣金接口
      'MALLAGENTAGENTINFO' : '/api/'+bizId+'/mall/agent/agent-info',//省市县代理头部
      // 秒省二期
      'SALEVOLUMERANK' : '/api/'+bizId+'/amoy/goods/sale-volume-rank',//商品热销
      'INCOMRANK' : '/api/'+bizId+'/amoy/goods/income-rank',//收益排行
      'CHALLENGEINDEX' : '/api/'+bizId+'/amoy/goods/challenge-index',//挑战首页
      'CREATECHALLENGETASK' : '/api/'+bizId+'/amoy/goods/create-challenge-task',//参加挑战
      'UPDATECHALLENGETASK' : '/api/'+bizId+'/amoy/goods/update-challenge-task',//后台计时任务没跑 但是升级条件已经完成  及时更新权益状态
      'UODATEALERTSTATUS' : '/api/'+bizId+'/amoy/goods/update-alert-status',//参加挑战
      'AREAGOODSLIST' : '/api/'+bizId+'/amoy/goods/area-goods-list',//活动专区商品列表
      'AREAGOODSDETAIL' : '/api/'+bizId+'/amoy/goods/area-goods-detail',//活动专区商品详情
      'AREAGOODSCATEGORY' : '/api/'+bizId+'/amoy/goods/area-goods-category',//分类
      'MYPOINTLIST' : '/api/'+bizId+'/amoy/goods/my-point-list',//积分明细
      'ORDERLIST' : '/api/'+bizId+'/amoy/goods/order-list',//返积分列表
      'ALLORDERLIST' : '/api/'+bizId+'/amoy/goods/all-order-list',//订单列表
      'GETCATEGOODSLIST' : '/api/'+bizId+'/amoy/goods/get-cate-goods-list',//分类商品
      'ACTIVESLIDE' : '/api/'+bizId+'/amoy/goods/slide',//活动专区轮播图
      'CANCELORDER' : '/api/'+bizId+'/amoy/goods/cancel-order',//取消订单
      'GOTOPAY' : '/api/'+bizId+'/amoy/goods/go-to-pay',//取消订单
      'APPLYRETURNGOODS' : '/api/'+bizId+'/amoy/goods/apply-return-goods',//退款
      'CONFIRMRECEIPT' : '/api/'+bizId+'/amoy/goods/confirm-receipt',//退款
    },

    /**
     * get 请求
     * @param {string} url 接口地址
     * @param {Object} param 传参
     */
	get: function(url, param) {

        return new Promise((resolve, reject) => {
            if (!param) {
              param = {}
            }
            const CancelToken = axios.CancelToken;
				axios.defaults.transformRequest = (data) => {
				data = Qs.stringify(data)
				return data
			}
            axios({
                method: 'get',
                url,
                params: param,
                cancelToken: new CancelToken(c => {
                    cancel = c
                })
            }).then(res => {
                if (res.data.code === 0) {
                    resolve(res.data)
                }else if(res.data.code === 403){
                    
                    dsBridge.call("toLogin")
                } else if(res.data.code === 412){
                    dsBridge.call("openWin", '/judgemobile')
                }else {
                    resolve(res.data)
                    //Vue.$vux.toast.text(res.msg)
                }
            }).catch(error => {
                if (Vue.$vux.loading) {
                    Vue.$vux.loading.hide()
                }
                console.log(error)
            })
          })

    },
    /**
     * post 请求
     * @param {string} url 接口地址
     * @param {Object} param 传参
     * @param {boolean} show 是否成功失败都执行回调 true:都执行回调， false:只有成功走回调
     * @param {boolean} loading 是否加载loading 版本310之后才管用
     */
    post: function(url, param, show,loading) {
      return new Promise((resolve, reject) => {
        // 显示loading
        if (loading && codeVersion >= 310) {
            dsBridge.call('common',{code:2,data:{type:1}},(ret) => {})
        }
        if (!param) {
          param = {}
        }
        const CancelToken = axios.CancelToken;
          axios.defaults.transformRequest = (data) => {
          data = Qs.stringify(data)
          return data
        }
        axios({
          method: 'post',
          url,
          data: param,
          cancelToken: new CancelToken(c => {
            cancel = c
          })
        }).then(res => {
          // 隐藏loading
          if (loading && codeVersion >= 310) {
              dsBridge.call('common',{code:2,data:{type:0}},(ret) => {})
          }
          if (!res) {
            return
          }
          if (res.data.code === 0) {
            resolve(res.data)
          }else if(res.data.code === 403){
              dsBridge.call("toLogin")
          }else if(res.data.code === 412){
              dsBridge.call("openWin", '/judgemobile')
          } else {
            if (show) {
              resolve(res.data)
            } else {
              dsBridge.call("toast", {msg: res.data.msg});
            }
          }
        }).catch(error => {
          if (error.message !== '操作取消') {
            resolve(error)
          }
          console.log(error)
        })
      })
    },

    getToken: function(){
        var t = utils.storage.get('token');
        return t;
    },
    handleRes: function(params,res){
        if(typeof res == 'string' ){
            res = JSON.parse(res)
        }
        if(res.code==0){
            params.success && params.success(res)
        } else {
            if(res.code==1 || res.code == 2 || res.code == 3 || res.code == 4){
                if(params.error){
                    params.error(res);
                } else {
                    //api.toast({msg:res.msg});
                }
            }else if(res.code==403){
                //api.toast({msg:'授权失效或未授权,请重新登录'});
				utils.auth.toLogin();
                utils.storage.remove('token')
                utils.storage.remove('userInfo')

            }
        }
    }
}
