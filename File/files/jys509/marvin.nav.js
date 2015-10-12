var a = $(document);
a.ready(function () {
    var b = $('body'),
        c = 'cnblogs_post_body',
        d = 'sideToolbar',
        e = 'sideCatalog',
        f = 'sideCatalog-catalog',
        g = 'sideCatalogBtn',
        h = 'sideToolbar-up',
        i = '<div id="sideToolbar"style="display:none;">\<div class="sideCatalogBg"id="sideCatalog">\<div id="sideCatalog-sidebar">\<div class="sideCatalog-sidebar-top"></div>\<div class="sideCatalog-sidebar-bottom"></div>\</div>\<div id="sideCatalog-catalog">\<ul class="nav"style="width:175px;zoom:1">\</ul>\</div>\</div>\<a href="javascript:void(0);"id="sideCatalogBtn"class="sideCatalogBtnDisable"></a>\<a href="javascript:void(0)"id="sideToolbar-up"></a>\</div>',
        j = '',
        k = 1900,
        l = 0,
        m = 0,
        n = 0,
        o, p = 13,
        q = true,
        r = true,
        s = $('#' + c);
    if (s.length === 0) {
        return
    };
    b.append(i);
    o = s.find(':header');
    if (o.length > p) {
        r = false;
        var t = s.find('h1');
        var u = s.find('h2');
        var u = s.find('h3');
        if (t.length + u.length > p) {
            q = false
        }
    };
    o.each(function (t) {
        var u = $(this),
            v = u[0];

        var title=u.text();
        var text=u.text();

        u.attr('id', 'autoid-' + l + '-' + m + '-' + n)
        //if (!u.attr('id')) {
        //    u.attr('id', 'autoid-' + l + '-' + m + '-' + n)
        //};
        if (v.localName === 'h1') {
            l++;
            m = 0;
            if(text.length>20) text=text.substr(0,20)+"...";
            j += '<li><span>' + l + '&nbsp&nbsp</span><a href="#' + u.attr('id') + '" title="' + title + '">' + text + '</a><span class="sideCatalog-dot"></span></li>';
        } else if (v.localName === 'h2') {
            m++;
            n = 0;
            if(q){
	            if(text.length>18) text=text.substr(0,16)+"...";
	            j += '<li class="h2Offset"><span>' + l + '.' + m + '&nbsp&nbsp</span><a href="#' + u.attr('id') + '" title="' + title + '">' + text + '</a></li>';
        	}
        } else if (v.localName === 'h3') {
            n++;
            if(r){
            	j += '<li class="h3Offset"><span>' + l + '.' + m + '.' + n + '&nbsp&nbsp</span><a href="#' + u.attr('id') + '" title="' + title + '">' + u.text() + '</a></li>';
        	}
        }
    });
    $('#' + f + '>ul').html(j);
    b.data('spy', 'scroll');
    b.data('target', '.sideCatalogBg');
    $('body').scrollspy({
        target: '.sideCatalogBg'
    });
    $sideCatelog = $('#' + e);
    $('#' + g).on('click', function () {
        if ($(this).hasClass('sideCatalogBtnDisable')) {
            $sideCatelog.css('visibility', 'hidden')
        } else {
            $sideCatelog.css('visibility', 'visible')
        };
        $(this).toggleClass('sideCatalogBtnDisable')
    });
    $('#' + h).on('click', function () {
        $("html,body").animate({
            scrollTop: 0
        }, 500)
    });
    $sideToolbar = $('#' + d);
    a.on('scroll', function () {
        var t = a.scrollTop();
        if (t > k) {
            $sideToolbar.css('display', 'block')
        } else {
            $sideToolbar.css('display', 'none')
        }
    })
});