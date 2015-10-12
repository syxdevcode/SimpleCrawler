/// <reference path="../../../../../01文件/05_svn/blogs/blogs/blogs.web/scripts/jquery-1.8.2.js" />
/// <reference path="../../../../../学习/svn/blogs/blogs/blogs.web/scripts/jquery-1.8.2.js" />
/// <reference path="../../javascript/js基础/scripts/jquery-1.10.2.js" />
/// <reference path="http://localhost:6312/AllTrust/Scripts/jquery-1.6.4.js" />

/**
  不知道为什么页面加载完成时还读不到div_digg。可能也是动态生成的。
  所以这里只能用定时器 不断的读取，当读取到了再给它动态添加快捷按钮
**/

//自定义 定时器[当元素加载完成是执行回调函数]
function customTimer(inpId, fn) {
    if ($(inpId).length) {
        fn();
    }
    else {
        var intervalId = setInterval(function () {
            if ($(inpId).length) {  //如果存在了
                clearInterval(intervalId);  // 则关闭定时器
                customTimer(inpId, fn);              //执行自身
            }
        }, 100);
    }
}

//读取 标签
function gettag() {
    $.ajax({
        type: "get",
        dataType: 'html',
        url: "http://www.cnblogs.com/zhaopei/tag",
        data: {},
        beforeSend: function (XMLHttpRequest) {//当一个Ajax请求开始时触发。
        },
        complete: function (jqXHR, status, responseText) {//请求完成时触发这个事件
        },
        success: function (data) {
            debugger;
            //设置宽度一致
            $(".select_list_tag").css("width", $(".text_select_tag").css("width"));
            $(".hidden_tag").val("");
            var a = $(data).find("#MyTag1_dtTagList td a");
            var span = $(data).find("#MyTag1_dtTagList td span.small");
            for (var i = 0; i < a.length; i++) {
                //var tagc = "";
                //if (i % 3 == 0)
                //    tagc = "tagc1";
                //else if (i % 2 == 0)
                //    tagc = "tagc2";
                //else
                //    tagc = "tagc5";

                //var html_a = "<a href='http://www.cnblogs.com/zhaopei/tag/" + a[i].innerHTML + "/' \
                //                 class='" + tagc + "'\
                //                 title='" + a[i].innerHTML + "'>" +
                //                 a[i].innerHTML + span[i].innerHTML +
                //              "</a>\
                //               </br>";
                //$("#tagscloud").append(html_a);
                $(".hidden_tag").append(a[i].innerHTML + "&");
            }
            //yuntagF();
            get_list_tag();
        },
        error: function (msg) {
        }
    });
}

//标签 搜索 自动补全 
function get_list_tag() {
    if (!$(".hidden_tag").text()) return;
    $("#get_list_tag_text").html("");
    var list_tag = $(".hidden_tag").text().split("&");
    for (var i = 0; i < list_tag.length; i++) {
        var html_select = "<option value='" + list_tag[i] + "'>" + list_tag[i] + "</option>";
        $("#get_list_tag_text").append(html_select);
    }
}

function set_tag_a_value() {
    $(".a_open_tag").attr("href", "http://www.cnblogs.com/zhaopei/tag/" + $(".text_select_tag").val() + "/");
}

//回车搜索标签
function open_Search(e) {
    var ev = e || window.event;
    if (ev.keyCode == 13 && $(".a_open_tag").attr("href") != "#") {//13  回车        
        //window.location.href = $(".a_open_tag").attr("href");
        document.getElementById("a_open_tag").click();
    }
}

//必应搜索框的值改变时
function up_bing_Search() {
    $(".a_bing_Search").attr("href", "http://cn.bing.com/search?q=" + $(".text_bing_Search").val() + "+site:cnblogs.com/zhaopei");
}
//回车搜索
function keyup_bing_Search(e) {
    var ev = e || window.event;
    if (ev.keyCode == 13 && $(".a_bing_Search").attr("href") != "#") {//13  回车       
        $(".span_bing_Search").click();
        // window.open($(".a_bing_Search").attr("href"), 'newwindow', 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 30) + ',top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes')
    }
}

//标签搜索 框
function addDiv_selestTag() {
    $("#widget_my_google").hide();//隐藏谷歌搜索
    var html = "<div class='div_my_zzk clearfix'>\
                    <input class='text_bing_Search' type='text' value='' onkeyup='keyup_bing_Search();' oninput='up_bing_Search();' />\
                    <a href='#' class='a_bing_Search' target='_blank'><span class='span_bing_Search'>必应搜索</span></a>\
                </div>\
                <div class='div_select_tag div_my_zzk clearfix'>\
                    <input class='text_select_tag' type='text' value='' list='get_list_tag_text' onkeyup='open_Search();' oninput='set_tag_a_value();' />\
                    <a href='#' class='a_open_tag' id='a_open_tag' target='_blank'>打开标签</a>\
                    <datalist id='get_list_tag_text'></datalist>\
                    <input type='hidden' class='hidden_tag' />\
                </div>";
    $(".mySearch").append(html);
}

//获取 滚动条距离浏览器顶部的高度
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

function animation() {
    $("#mainContent .day").each(function () {
        $(this).css("-webkit-transform", "rotateZ(360deg)").css("-webkit-transition", "all 0.6s ease-out");
    });
}

//添加 评论区的 形象照
function addImage() {
    var spen_html = "<span class='bot' ></span>\
                         <span class='top'></span>";
    $(".blog_comment_body").append(spen_html);

    $(".blog_comment_body").before("<div class='body_right' style='float: left;'><a target='_blank'><img  /></a></div>");
    var feedbackCon = $(".feedbackCon").addClass("clearfix");
    for (var i = 0; i < feedbackCon.length; i++) {
        var span = $(feedbackCon[i]).find("span:last")[0].innerHTML || "http://pic.cnitblog.com/face/sample_face.gif";
        $(feedbackCon[i]).find(".body_right img").attr("src", span);
        var href = $(feedbackCon[i]).parent().find(".comment_date").next().attr("href");
        $(feedbackCon[i]).find(".body_right a").attr("href", href);

    }
}



//页面加载完成是执行
$(function () {
    //添加 关注  顶部  评论  区
    customTimer("#div_digg", function () {
        var div_html = "<div class=''>\
                        <a href='javascript:void(0);' onclick='c_follow();'>关注</a>\
                         &nbsp;|&nbsp;\
                        <a href='#top'>顶部</a>\
                         &nbsp;|&nbsp;\
                        <a href='javascript:void(0);' onclick=\" $('#tbCommentBody').focus();\">评论</a>\
                   </div>";
        $("#div_digg").append(div_html);
        //tbCommentBody    


    });

    customTimer(".div_my_zzk", function () {
        $(".div_my_zzk").addClass("clearfix");
    });


    //添加 评论区的 形象照
    customTimer(".blog_comment_body", addImage);

    //这里为什么死循环？因为在翻页的时候是重新加载评论区，不会在 执行 气泡评论 和加载每个人的形象照
    setInterval(function () {
        var feedbackCon = $(".feedbackCon");
        if (feedbackCon.length >= 1 && $(feedbackCon[0]).find(".body_right img").length <= 0) {
            addImage();
        }
    }, 1000);

    //读取 标签
    customTimer(".text_select_tag", gettag);
    //标签搜索 框
    customTimer(".mySearch", addDiv_selestTag);

    customTimer("#div_digg", function () {
        //$("#div_digg").css("display", "none");
    })

    customTimer("#sideToolbar", function () {
        $("#sideToolbar").css("display", "none");
        $("#open_directory").parents("div").css("display", "");
    })

    //除去广告
    customTimer("#google_ad_c1", function () {
        try {
            $("#google_ad_c1").remove();
            $("#under_post_news").remove();
            $("#google_ad_c2").remove();
            $("#under_post_kb").remove();
            $("#site_nav_under").remove();

        } catch (e) { }
    })

    //--------------------------------
    var istype = $(".entrylistTitle").length > 0;//是否是类型页面
    var ishome = $(".postTitle").length > 1;//是否是主页
    var istag = $(".PostListTitle").length > 0;//是否是标签页面
    if (istype || ishome || istag) {
        $("#footer").css("margin-right", "340px").css("margin-top", "100px").css("padding-top", "10px").css("background-color", "#F9F9F9");
        $(".divyoulian").css("margin-right", "340px").css("padding-bottom", "10px").css("background-color", "#F9F9F9");
    }

    if ($(".postTitle").length == 1) {
        var divhtml = "<div class='zdycz clearfix'><input class='but_quanping' type='button' value='全屏'/><input class='but_mulu' type='button' value='目录'/></div>";
        $(".forFlow").prepend(divhtml);
        $(".but_quanping").click(function () {
            if ($(this).val() == "全屏") {
                //font-size: 20px;
                //font-weight: 400;
                $("#mainContent").css("margin", "5px 30px");//sideBar
                $("#sideBar").css("display", "none");//header
                $("#header").css("display", "none");//header
                $("#cnblogs_post_body p").css("font-size", "20px").css("font-weight", "400");
                $("#cnblogs_post_body li").css("font-size", "20px").css("font-weight", "400");
                $("#cnblogs_post_body a").css("font-size", "20px").css("font-weight", "400");
                $("strong").css("font-size", "20px").css("font-weight", "400");
                //cnblogs_post_body
                //sideCatalog-catalog   
                $(this).val("退出全屏");
            }
            else {
                $("#mainContent").css("margin-right", "330px").css("margin-left", "0px");//sideBar
                $("#sideBar").css("display", "inherit");//header
                $("#header").css("display", "inherit");//header
                $("#cnblogs_post_body p").css("font-size", "18px").css("font-weight", "300");
                $("#cnblogs_post_body li").css("font-size", "18px").css("font-weight", "300");
                $("#cnblogs_post_body a").css("font-size", "18px").css("font-weight", "300");
                $("strong").css("font-size", "18px").css("font-weight", "300");
                $(this).val("全屏");
            }
        });
        $(".but_mulu").click(function () {
            $("#sideCatalog-catalog li").css("font-size", "14px").css("font-weight", "400");
            if ($(this).val() == "目录") {
                $("#sideToolbar").css("display", "inherit");
                $("#open_directory").parents("div").css("display", "none");
                $(this).val("隐藏目录");
            }
            else {
                $("#sideToolbar").css("display", "none");
                $("#open_directory").parents("div").css("display", "inherit");
                $(this).val("目录");
            }
        });

        //$(".but_quanping").click();
        try {
            $("#mainContent").css("margin-right", "330px").css("margin-left", "0px");//sideBar
            $("#sideBar").css("display", "inherit");//header
            $("#header").css("display", "inherit");//header
            $("#cnblogs_post_body p").css("font-size", "18px").css("font-weight", "300");
            $("#cnblogs_post_body li").css("font-size", "18px").css("font-weight", "300");
            $("#cnblogs_post_body a").css("font-size", "18px").css("font-weight", "300");
            $("strong").css("font-size", "18px").css("font-weight", "300");

        } catch (e) { }

    }
    //--------------------------------   

    //$("p").prepend("&nbsp;&nbsp;&nbsp;&nbsp;");

    //--------------------------------
    var divhtml = "<div class='myadd clearfix'>\
                     <div class='myadd_left'><img src='http://images2015.cnblogs.com/blog/208266/201509/208266-20150913215146559-472190696.jpg'/></div>\
                     <div class='myadd_right'>\
                           <div><a href='http://www.cnblogs.com/zhaopei/p/4368417.html'>一、各大招聘网站信息实时查询浏览</a></div>\
                           <div><a href='http://www.cnblogs.com/zhaopei/p/4783986.html'>二、一步步开发自己的博客 .NET版</a></div>\
                           <div><a href='http://www.cnblogs.com/zhaopei/p/4174811.html'>三、博客园页面设置</a></div>\
                      </div>\
                   </div>\
    ";

    $(".forFlow").prepend(divhtml);
    //--------------------------------

    //--------------------------------

    customTimer("#sideToolbar", function () {
        var addpostBody = "<div class='addpostBody'><h1>阅读目录</h1>\
                               <div>" + $("#sideToolbar").html() + "</div>\
                           </div>";
        $(addpostBody).find("#sideToolbar").css("display", "");
        //$(addpostBody).find("a").css("font-size", "18px").css("font-weight", "300");
        $(".postBody").prepend(addpostBody);
    });

    //--玩玩而已
    customTimer("#digg_count", function () {
        var myhref = "http://www.cnblogs.com/zhaopei/p/4783986.html";
        if (location.href == myhref) {
            var digg = $("#digg_count").html();
            digg = parseInt(digg);
            $("#digg_count").html(digg);
        }
    })

    //--------------------------------

    // 页面滚动条事件
    window.onscroll = function () {
        var scrolltop = getScrollTop();
        if (scrolltop >= 250) {
            $("#tagscloud").fadeOut(500); //标签云
        }
        else {
            $("#tagscloud").show();
        }

        //if (scrolltop >= 300 && $("#open_directory").parents("div").css("display") == "none")
        //    $("#sideToolbar").css("display", "initial"); //目录div
        //else
        //    $("#sideToolbar").css("display", "none");

        //        if (scrolltop >= 450)
        //            $("#div_github").hide(500);//.css("display", "none");
        //        else
        //            $("#div_github").show(100);// .css("display", "block");

        if (scrolltop >= 1900)
            $("#div_digg").css("display", "block");
        else
            $("#div_digg").css("display", "none");

        try {
            //console.log(scrolltop);
        } catch (e) { }

    }

    //隐藏订阅的图片
    $("#MyLinks1_XMLLink").hide();

    animation();
});

//添加留言板
$("#navList").append("<li><a id='' class='menu' href='http://www.cnblogs.com/zhaopei/articles/4213784.html'>留言</a></li>\
                      <li><a id='' class='menu' href='http://www.cnblogs.com/zhaopei/articles/4225735.html'>关于</a></li>\
                      <li><a id='' target='_blank' style='color:red;font-size:12px;text-decoration: none' class='menu' href='http://www.haojima.net'>haojima.net&nbsp;&nbsp;<span class='myurlspan' style='color:#0094ff;'>好记吗<span style='font-weight:bold'>?</span></span></a></li>");

//$("body,html").animate({ scrollTop: 0 }, 150);