$(function () {
    var div_html = "<div class='topblog'>";
    div_html += "<h3><p></p></h3>";

    div_html += "<iframe src='https://channel9.msdn.com/Series/MVA-China/20140116VSA01/player' width='32%' height='205' allowFullScreen frameBorder='0'></iframe>";




    div_html += "<ul>";
	div_html += "<li><a href='http://www.cnblogs.com/fenglingyi/p/4708006.html'>网络爬虫+HtmlAgilityPack+windows服务从博客园爬取20万博文       <span>网络爬虫</span></a></li>";
    div_html += "<li><a href='http://www.cnblogs.com/fenglingyi/p/4750323.html'>总结一下工作中遇到的NPOI以及在ASP.NET MVC中的使用<span>ASP.NET MVC</span></a></li>";
    div_html += "<li><a href='http://www.cnblogs.com/fenglingyi/p/4783018.html'>曾几何时，你是否也曾有一个博客梦?  群内共享源码：469075305 <span>博客开源系列</span></a></li>";
    div_html += "</ul>";
    div_html += "</div>";

    var div_html1 = "<aside class='navsidebar'>";
    div_html1 += "<nav> <ul>";
    div_html1 += " <li class='ab'><a href='http://home.cnblogs.com/u/fenglingyi/'>关于我</a></li>";
    div_html1 += "<li class='sy'><a href='http://q.cnblogs.com/'>博问</a></li>";
    div_html1 += " <li class='js'><a href='http://home.cnblogs.com/ing/'>闪存</a></li>";
    div_html1 += "<li class='msh'><a href='http://space.cnblogs.com/msg/send/fenglingyi'>联系</a></li>";
    div_html1 += " <li class='xc'><a href='http://www.cnblogs.com/fenglingyi/rss'>订阅</a></li>";
    div_html1 += "<li class='ly'><a href='http://i.cnblogs.com/'>管理</a></li>";
    div_html1 += "</ul></nav> ";
    div_html1 += "</aside>";

    $("#header").append(div_html);
    $("#header").append(div_html1);
});