function addHover(linkName, divName) {
    var link = $('#' + linkName)
    var navDiv = $('#' + divName)
    link.hover(
            function() {
                navDiv.css({ top: jQuery(this).offsetTop()  - 10 + "px", left: jQuery(this).offsetLeft()  - 5+ "px" });
                navDiv.hover(null, function() { navDiv.fadeOut(500, null) });
                navDiv.fadeIn(500);
            });
}
function loadNavDiv(divName) {
    var navDiv = $('#' + divName)
    if (navDiv.length == 0) {
        $(document.body).append("<div id='nav1' class='panel'/>");
        navDiv = $('#' + divName)
        $.ajax({
            type: "GET", url: "http://www.cnblogs.com/ldp615/archive/2009/08/07/1541404.html", dataType: "html",
            success: function(response) {
                navDiv[0].innerHTML = response
                navDiv[0].innerHTML = "<p style='color: #999'>移开鼠标关闭本窗口</p></br>" + $('#nav')[0].innerHTML;
            }
        });
    }
}
/**
by Peter-Paul Koch & Alex Tingle
*/
jQuery.fn.offsetLeft = function() {

    var e = $(this)[0];
    var curleft = 0;
    if (e.offsetParent)
        while (1) {
        curleft += e.offsetLeft;
        if (!e.offsetParent)
            break;
        e = e.offsetParent;
    }
    else if (e.x)
        curleft += e.x;
    return curleft;
}

jQuery.fn.offsetTop = function() {

    var e = $(this)[0];
    var curtop = 0;
    if (e.offsetParent)
        while (1) {
        curtop += e.offsetTop;
        if (!e.offsetParent)
            break;
        e = e.offsetParent;
    }
    else if (e.y)
        curtop += e.y;
    return curtop;
}