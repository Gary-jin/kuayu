utils = {
  storage: {
    set: function (key, data) {
      if (dsBridge) {
        // 有全局api对象时用原生存储
        try {
		  dsBridge.call("setPrefs", {key: key, value: JSON.stringify(data)})
        } catch (err) {
		  dsBridge.call("setPrefs", {key: key, value: JSON.stringify(data)})
        }
      } else {
        // 没有全局api对象时
        try {
          return window.localStorage.setItem(key, window.JSON.stringify(data))
        } catch (err) {
          return window.localStorage.setItem(key, data)
        }
      }
    },
    get: function (key) {
      if (dsBridge) {
        // 有全局api对象时用原生存储
		
          try {
              return JSON.parse(dsBridge.call("getPrefs", {key: key}))
          } catch (err) {
              return dsBridge.call("getPrefs", {key: key})
          }
      } else {
        // 没有全局api对象时
        try {
          return window.JSON.parse(window.localStorage.getItem(key))
        } catch (err) {
          return window.localStorage.getItem(key)
        }
      }
    },
    remove: function (key) {
      if (dsBridge) {
		dsBridge.call("removePrefs", {key: key})
      } else {
        return window.localStorage.removeItem(key)
      }
    }
  },
  auth: {
    toLogin: function(){
      //api.execScript({
          //name: 'main',
          //script: 'localStorage.removeItem("token");localStorage.removeItem("userInfo");vueObj.jumpTo("/wechatLogin");'
      //});
      //setTimeout(function(){
        //api.closeWin();
      //}, 500)
	  dsBridge.call("toLogin")
    }
  },
  copyText: function(text, callback){
    var input = document.createElement('input')
    input.style.position = 'absolute';
    input.value = text
    document.body.appendChild(input)
    input.select()
    input.setSelectionRange(0, input.value.length)
    document.execCommand('Copy')
    document.body.removeChild(input)
    return callback && callback();
  },
  isPhone:function () {
    if (dsBridge) {
      let userPhone = dsBridge.call("getUserPhone","")
      let codeVersion = dsBridge.call('receiveParams', 'codeVersion')
      if( userPhone === '' || userPhone === null && codeVersion >= 300){
          dsBridge.call("toast", {msg: '您还未绑定手机号，请先去绑定！'})
          setTimeout(function(){
          dsBridge.call("openWin", '/judgemobile')
          },1000)
          return false
      }else{
        return true
      }
    }
  },
  /**
   * 格式化时间戳
   * @param {string} dateStr 要格式化的时间戳
   * @param {string} 目标格式 如"yyyy-MM-dd hh:mm:ss"
   */
  formatDate(dateStr, fmt) {
    let date = new Date(dateStr);
    var o = { 
        "M+" : date.getMonth()+1,                 //月份 
        "d+" : date.getDate(),                    //日 
        "h+" : date.getHours(),                   //小时 
        "m+" : date.getMinutes(),                 //分 
        "s+" : date.getSeconds(),                 //秒 
        "q+" : Math.floor((date.getMonth()+3)/3), //季度 
        "S"  : date.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
  }
}
