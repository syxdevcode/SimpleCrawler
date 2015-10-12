function customTimer(inpId,fn) {
  if ($(inpId).length) {
    fn();
  }
  else {
    var intervalId = setInterval(function () {
      if ($(inpId).length) {
        clearInterval(intervalId);
        customTimer(inpId,fn);
      }
    }, 100);
  }
}

$(function () {
  customTimer("#div_digg", function () {
    var div_html = "<div class=''>\<a href='javascript:void(0);' onclick='c_follow();'>关注</a>\| \<a href='#top'>顶部</a>\| \<a href='javascript:void(0);' onclick=\" $('#tbCommentBody').focus();\">评论</a>\ </div>";
    $("#div_digg").append(div_html);
  });
});