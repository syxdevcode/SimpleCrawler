/// <reference path="../../../lookingjob/lookingjob/job.ui/resources/script/jquery-1.7.1.min.js" />

var a = $(document);
a.ready(function () {
    var b = $('body'),
        c = 'cnblogs_post_body',
        i = '<div id="sideToolbar" style="display:none"><div class="sideCatalogBg"id="sideCatalog"><div id="sideCatalog-sidebar"><div class="sideCatalog-sidebar-top"></div><div class="sideCatalog-sidebar-bottom"></div></div><div id="sideCatalog-catalog"><ul class="nav"style="zoom:1"></ul></div></div></div>',
        j = '<div style="text-align: right" class="close_directory"><a id="close_directory" style="cursor: default;color:red">关闭</a>&nbsp;&nbsp;</div>',
        k = "<div style='position:fixed;right:0px;top:300px;display:none;'><a id='open_directory' href='javascript:void(0)' style='padding:4px;color:#0094ff'>打开目录<a/></div>",
        l = 0,
        m = 0,
        s = $('#' + c);
    b.append(k);
    b.append(i);
    var o = s.find(':header');
    o.each(function (t) {
        var u = $(this),
            v = u[0];

        var title = u.text();
        var text = u.text();

        u.attr('id', 'autoid-' + l + '-' + m)

        if (v.localName === 'h1') {
            l++;
            m = 0;
            if (text.length > 26) text = text.substr(0, 26) + "...";
            j += '<li><a href="#' + u.attr('id') + '" title="' + encodeHtml(title) + '">' + encodeHtml(text) + '</a></li>';
        } else if (v.localName === 'h2') {
            m++;
            if (text.length > 30) text = text.substr(0, 30) + "...";
            j += '<li class="h2Offset"><a href="#' + u.attr('id') + '" title="' + encodeHtml(title) + '">' + encodeHtml(text) + '</a></li>';
        }
    });
    if (l != 0)
        $('#sideCatalog-catalog>ul').html(j);
    $('body').scrollspy({
        target: '.sideCatalogBg'
    });
    $("#close_directory").click(function () {
        $("#sideToolbar").css("display", "none");
        $("#open_directory").parents("div").css("display", "");
    });
    //开打目录
    $("#open_directory").click(function () {
        $("#sideToolbar").css("display", "");
        $("#open_directory").parents("div").css("display", "none");
    });
});

var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
function encodeHtml(s) {
    return (typeof s != "string") ? s :
        s.replace(REGX_HTML_ENCODE,
                  function ($0) {
                      var c = $0.charCodeAt(0), r = ["&#"];
                      c = (c == 0x20) ? 0xA0 : c;
                      r.push(c); r.push(";");
                      return r.join("");
                  });
}