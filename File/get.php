
(function () {
var load = function() {
    var node, scripts = document.body.getElementsByTagName("script"),
    src = "http://api.geetest.com/get.php?gt=d47a8b04a734e1c80a3f01fb462a0f41&product=popup&sdk=discuz_1.0&rand=2072788485&popupbtnid=header-loggin-btn";
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src == src) {
            node = scripts[i];
            if(window.Geetest) {
                new Geetest({"gt": "d47a8b04a734e1c80a3f01fb462a0f41", "product": "popup", "height": 116, "logo": true, "theme_version": "3.0.14", "id": "ad6c6b9e1c10032bfd88b6e53c320e4c4", "popupbtnid": "header-loggin-btn", "theme": "golden", "version": "3.0.31", "imgserver": "http://static.geetest.com/", "https": false, "type": "slide", "xpos": 0, "bg": "pictures/gt/d7a70eb60/bg/14fa5648.jpg", "fullbg": "pictures/gt/d7a70eb60/d7a70eb60.jpg", "staticserver": "http://static.geetest.com/", "ypos": 0, "slice": "pictures/gt/d7a70eb60/slice/14fa5648.png", "link": "", "mobile": false, "challenge": "d6c6b9e1c10032bfd88b6e53c320e4c4hj", "apiserver": "http://api.geetest.com/", "clean": false}, true).appendTo(node, true);
            }
            else {
                setTimeout(load, 100);
            }
            break;
        }
    }
};
if(!document.getElementById('gt_lib')) {
    var s = document.createElement('script');
    s.id = 'gt_lib';
    s.src = 'http://static.geetest.com/static/js/geetest.3.0.31.js';
    s.charset = 'UTF-8';
    s.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(s);
    var loaded = false;
    s.onload = s.onreadystatechange = function () {
        if (!loaded && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
            loaded = true;
            if (typeof window.gt_onload == 'function'){
                window.gt_onload(false);
            }
        }
    };
}
load()
}());
