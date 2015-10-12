
var start = 1;

var _html = '<div class="blogpopMain"><div class="l">'
          + '<a href="http://blog.51cto.com/zt/654" target="_blank"><img src="http://s3.51cto.com/wyfs02/M01/5B/C8/wKiom1USiDqD35MdAAA08cHqE6s548.jpg" width="105" height="105" /></a>'
          + '<p><a href="http://blog.51cto.com/zt/654" target="_blank">Exchange之ADFS单点登录</a></p></div>'
          + '<div class="r"><h4 style="text-align:left;"><a href="http://chenguang.blog.51cto.com/350944/1623321" target="_blank">如何轻松搞定日志的可视化？</a></h4>'
          + '<ul>'
          + '<li><a href="http://wangwei007.blog.51cto.com/68019/1623329" target="_blank">MariaDB10.0实例部署和多源配置</a></li>'
          + '<li><a href="http://wangchunhai.blog.51cto.com/225186/1620749" target="_blank"style="color:red;">为VMware ESXi主机添加本地存储</a></li>'
          + '<li><a href="http://markwin.blog.51cto.com/148406/1623252" target="_blank">微信语音遥控Win Azure云虚拟机</a></li>'
          + '<li><a href="http://edu.51cto.com/course/course_id-1742.html" target="_blank"style="color:red;">VMware Workspace 全网唯一教程</a></li>'
          + '</ul>'
          + '</div></div>'

          + '';


jQuery('#showMessagerDim').show();

jQuery(function(){
//window.onload=function(){
   if(get_cookie('blog_top')==''&&start==1){
//	 show_pop();
	    jQuery.messager.showblogtop('', _html);
        var date=new Date();
	    var day = 1442505600000;//34122000
	    date.setTime(day);
	    var test = date.getTime();
	    document.cookie="blog_top=yes;domain=.blog.51cto.com;expires="+date.toGMTString()+";path=/;";
    }
	jQuery("#showMessagerDim").click(function(){
		jQuery.messager.showblogtop('', _html);
		//removeIframe();
	});
//}
});


function get_cookie(Name) {
    var search = Name + "=";
    var returnvalue = "";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;

            end1 = document.cookie.indexOf(";", offset);

            if (end1 == -1)
            end1 = document.cookie.length;
            returnvalue=unescape(document.cookie.substring(offset, end1));
        }
    }
    return returnvalue;
}
