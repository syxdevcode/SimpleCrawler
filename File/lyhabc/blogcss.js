$(document).ready(function(){
	var isIE6 = navigator.appVersion.indexOf("MSIE"),
		base_css_url = "//files.cnblogs.com/lyhabc/base-skyking.css",
		css_media_url = "//files.cnblogs.com/gaizai/media-480.css",
		baiduAnalysis = "//hm.baidu.com/h.js?ae3d4aad2bdadaa0e9961d2c7a2585f3";
	
	$("head").prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0">' );
	$("head").append('<link type="text/css" rel="stylesheet" href="' + base_css_url + '" />' +
	'<link type="text/css" rel="stylesheet" href="' + css_media_url + '" />' +
	'<script src="' + baiduAnalysis + '" type="text/javascript"></script>');

	$("<div id='toTop'style='zoom:0;'></div>").appendTo($("body")).bind("click", function(){
		$("body,html").animate({ scrollTop: 0 }, 150);
	});
	
	var scrollTimer = null;
	$(window).bind("scroll", function(){
		clearTimeout(scrollTimer);
		scrollTimer = setTimeout(function(){
			if($("#div_digg").length > 0 && ($("#skyking-footer").offset().top - $("#div_digg").offset().top < 130)){
				$("#div_digg").fadeOut();
			}else{
				$("#div_digg").fadeIn();
			}
		}, 50);
	})

	var $fixBox = $("#div_digg");
	$("#div_digg").find(".diggit").on("click", function(){
		$fixBox.css("position", "static");
	});


});