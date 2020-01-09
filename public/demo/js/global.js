/**
 * 全局配置
 * @property {boolean} debug 是否开启调试模式 true:开启 false:关闭
 * */
var GlobalConfig = {
  debug: false
}

/**创建ajax请求对象 */
function GetHttpRequest()  
{  
    if ( window.XMLHttpRequest ) // Gecko  
        return new XMLHttpRequest() ;  
    else if ( window.ActiveXObject ) // IE  
        return new ActiveXObject("MsXml2.XmlHttp") ;  
}  
/**
 * 使用ajax同步请求js文件
 * @param {string} sId script标签的id
 * @param {string} url 要引入的js文件地址
 */
function ajaxFile(sId, url){  
    var oXmlHttp = GetHttpRequest() ;  
    oXmlHttp.onreadystatechange = function()    
     {  
        if (oXmlHttp.readyState == 4)  
        {  
           includeJS( sId, oXmlHttp.responseText );  
        }  
    }  
    oXmlHttp.open('GET', url, false);//同步操作  
    oXmlHttp.send(null);  
}  
/**
 * 将请求到的js文件内容写入页面
 * @param {string} sId script标签id
 * @param {string} source js文件内容
 */
function includeJS(sId, source){  
    if ( ( source != null ) && ( !document.getElementById( sId ) ) ){  
        var oHead = document.getElementsByTagName('HEAD').item(0);  
        var oScript = document.createElement( "script" );  
        oScript.type = "text/javascript";  
        oScript.id = sId;  
        oScript.text = source;  
        oHead.appendChild( oScript );  
    }  
}