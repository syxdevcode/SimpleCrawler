
var debug = false;
var interval = 1000;
$(document).ready(function () {
    setInterval(startAvatarWatcher, interval);
});


/**
* find the avatar holder(currently a span that its html content is the avatarUrl.),and make the avatar shown.
* 
* this is not an efficient way, but simple and works. 
* i use a timer to periodicaly scan the "feedbackCon" because of that the document ready event 
* does't fire after the comments pager changed and new comment added(for the cnblog render comments in an Ajax way.)
*/ http://pic.cnblogs.com/avatar/simple_avatar.gif
function startAvatarWatcher() {
    //var interval = 1000;
    $('.feedbackCon').each(function () {
        //hard code now.
        var urlHolder = $(this).find('span');
        if (urlHolder.length > 0) {
            var avatarUrl = $(urlHolder).html();
            //remove url holder
            urlHolder.remove();
            if (avatarUrl) {
                //append img
                fmt = '<img src="0" class="comment_avatar_img"/>';
                var img = fmt.replace(/0/g, avatarUrl);
                $(this).html(img + $(this).html());
            }
        } 
    });
    //setTimeout('startAvatarWatcher',interval);
}

/* unused,because ready event does't fire after the comments pager changed and new comment added. */

// $(document).ready(function() {	
// 	var interval = 600;
// 	var timer = setInterval(function(){
// 		if(renderCommentsFinished) {
// 			if(timer)
// 				clearInterval(timer);
// 			fixupCommentAvatar();
// 		}		
// 	},interval);
// });

// function renderCommentsFinished() {
// 	return $('#comments_pager_bottom').length > 0;
// }

// function fixupCommentAvatar() {

// 	startAvatarWatcher();

// 	$('.feedbackCon').each(function(){
// 		// id="comment_body_3182396" class="blog_comment_body"
// 		var commentBody = $(this).find('.blog_comment_body')[0];
// 		var avatarNumber = commentBody.id.match(/\d+/g)[0];
// 		if(debug)
// 			console.trace(avatarNumber);
// 		// comment_3182396_avatar
// 		var fmt = "comment_0_avatar";
// 		var urlHolderId = fmt.replace(/0/g,avatarNumber);
// 		var urlHolder = document.getElementById(urlHolderId);
// 		if(urlHolder){
// 			var avatarUrl = $(urlHolder).html();
// 			//remove url holder
// 			$(this)[0].removeChild(urlHolder);
// 			if(avatarUrl) {
// 				//append img
// 				fmt = '<img src="0" class="comment_avatar_img"/>';
// 				var img = fmt.replace(/0/g,avatarUrl);
// 				$(this).html(img + $(this).html());
// 			}
// 		}		
// 	});
// }