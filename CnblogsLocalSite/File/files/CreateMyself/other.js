$(function() {
	$('<i class="icon-triangle-up"></i>').appendTo("#navList li");
	$("#navList li a").mouseover(function() {
		$(this).siblings(".icon-triangle-up").show();
	}).mouseout(function() {
		$(this).siblings(".icon-triangle-up").hide();
	});

	$("h1.PostListTitle").css({
		"color": "#2da12d",
		"font-weight": "bolder"
	});
	$("h1.postTitle a").css({
		"color": "#2da12d",
		"font-weight": "bolder"
	});
	$("h1.entrylistTitle").css({
		"color": "#2da12d",
		"font-weight": "bolder"
	});
	$(".entrylistPosttitle a").css({
		"color": "#2da12d",
		"font-weight": "bolder"
	});
	$(".PostList a").css({
		"color": "#2da12d",
		"font-weight": "bolder"
	});

	$("#blog-calendar").remove();

	$('#calendar').jalendar({
		color: '#2da12d',
		lang: 'ES'
	});
	$("#calendar").addClass("jalendar").css("width", "300px");
	$(".jalendar-pages").css("width", "250px");
	$(".jalendar-wood").css("width", "250px");
	$(".add-event").remove();


});

jQuery.fn.wait = function(func, times, interval) {
	var _times = times || -1,
		//100次
		_interval = interval || 20,
		//20毫秒每次 
		_self = this,
		_selector = this.selector,
		//选择器
		_iIntervalID; //定时器id
	if (this.length) { //如果已经获取到了，就直接执行函数
		func && func.call(this);
	} else {
		_iIntervalID = setInterval(function query() {
			if (!_times) { //是0就退出
				clearInterval(_iIntervalID);
			}
			_times <= 0 || _times--; //如果是正数就 --
			_self = $(_selector); //再次选择
			if (_self.length) { //判断是否取到
				func && func.call(_self);
				clearInterval(_iIntervalID);
			}
		}, _interval);
	}
	return this;
}

function focusFunction() {
	var _targetTop = $('#comment_form_container').offset().top; //获取位置
	jQuery("html,body").animate({
		scrollTop: _targetTop
	}, 300); //跳转
}

function focusFollow() {
	var _targetTop = $('#profile_block').offset().top; //获取位置
	jQuery("html,body").animate({
		scrollTop: _targetTop
	}, 300); //跳转
}

$(document).ready(function() {
	$("<div id='toTop'style='zoom:0;'></div>").appendTo($("body")).bind("click", function() {
		$("body,html").animate({
			scrollTop: 0
		}, 150);
	});



	$("#cnblogs_post_body").append('<hr style="margin-bottom:10px;background-color:"#2da12d""/><pre id="declare">非常感谢您花时间读完这篇文章，如果您觉得此文不错，请点一下“<b>推荐</b>”按钮，您的<b>“推荐”</b>就是对我最大的鼓励以及不懈努力的肯定。<br/>本文版权归作者和博客园所有，来源网址：<a href="http://www.cnblogs.com/CreateMyself/">http://www.cnblogs.com/CreateMyself/</a>欢迎各位转载，转载文章之后必须在文章页面明显位置给出作者和原文连接，否则保留追究法律责任的权利以及小小的鄙视。')

	$('#declare').css({
		'border': 'dashed 1px #2da12d',
		'padding': '10px 15px',
		'background-color': '#f8f8f8'
	});



});

$("#div_digg").wait(function() {
	var html = '<div style="padding-bottom: 5px;">';
	if ($("#p_b_follow") != null) {
		if ($("#p_b_follow").text().indexOf("加关注") != -1) {
			html += '<a onclick="javascript:focusFollow();" href="javascript:void(0);">关注Recluse_Xpy</a>&nbsp;|&nbsp;';
		}
	}
	html += '<a onclick="javascript:focusFunction();" href="javascript:void(0);">快速评论</a>';
	html += '</div>';

	$(html).appendTo('#div_digg');
});