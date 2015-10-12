if( $(".runCode").length == 0 ) {
    $(".cnblogs_code").before( $('<p><span class="runCode">运行下面代码</span></p>') );
};

var isIE = /MSIE|Trident/i.test(navigator.userAgent.toLowerCase());
$(".runCode").on("click", function(evt) {
    evt.stopPropagation();
    var $this = $(this),
        $p = $this.parent("p").next(".cnblogs_code"),
        code = $p.text(),
        code = $p.hasClass('jscode') ? ( "log下面可能有测试的数据, 你可以按F12打开看看(笔记本按fn+F12)" + code + "") : code;
    //code = staticHtml.join(code);
    //alert(code);
    if (!isIE) {
        window.open(URL.createObjectURL(new Blob([code], {
            type: "text/html; charset=utf-8"
        })));
    } else {
        var d = window.open("about:blank").document;
        d.write(code);
        d.close();
    }
});