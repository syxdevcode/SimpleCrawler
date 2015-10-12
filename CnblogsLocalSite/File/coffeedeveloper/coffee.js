$(function(){
    var audioArr = [];
    var audioUrl = 'http://download.cnblogs.com/coffeedeveloper/';
    for(var i = 1; i <= 8; i++){
        audioArr.push(new Audio(audioUrl + i + (Modernizr.audio.mp3 ? '.mp3' : '.wav')))
    }
    $('#navList').on('mouseenter', 'li', function(){
		audioArr[$(this).index()].pause();
		audioArr[$(this).index()].currentTime = 0;
		audioArr[$(this).index()].play();
    });
    if($('#topics').size() > 0){
        function setSidebar() {
            if($('.catListView, .catListFeedback, .catListComment').size() > 0) {
                $('.catListView, .catListFeedback, .catListComment').css({
                    'position': 'static',
                    'background' : 'none',
                    'border' : 'none',
                    'width' : '100%',
                    'box-shadow' : 'none',
                    'height' : 'auto'
                })
                $('#mainContent .forFlow > div').css('width', '75%');
            }else {
                setTimeout(setSidebar, 100);
            }
        }
        setSidebar();
    }
});