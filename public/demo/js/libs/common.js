
//接收参数
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            //theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            //theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);//这个可以解决中文乱码的问题；
        }
    }
    return theRequest;
}

// 过滤日期
function formatDate (date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};
function padLeftZero (str) {
    return ('00' + str).substr(str.length);
};