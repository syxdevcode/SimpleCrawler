
var strSite = window.location.protocol + "//" + window.location.host + "/"; //// 网站主机头

var versionnum = "20151124"; 

var JSHash = {

    blog: { url: strSite + "Js/blog/blog.js", version: versionnum },
    publishBlog: { url: strSite + "Js/blog/publishBlog.js", version: versionnum },
    editBlog: { url: strSite + "Js/blog/editBlog.js", version: versionnum },
    fileUpload: { url: strSite + "Js/blog/fileUpload.js", version: versionnum }, 

    common: { url: strSite + "Js/common/common.js", version: versionnum },
    login: { url: strSite + "Js/common/login.js", version: versionnum },
    loginModal: { url: strSite + "Js/common/loginModal.js", version: versionnum }, 
    register: { url: strSite + "Js/common/register.js", version: versionnum },
    registerModal: { url: strSite + "Js/common/registerModal.js", version: versionnum }, 
    hoverCard: { url: strSite + "Js/common/hoverCard.js", version: versionnum }, 

    jquery_form: { url: strSite + "Js/jquery/jquery.form.js", version: versionnum },
    jquery_Jcrop: { url: strSite + "Js/jquery/jquery.Jcrop.js", version: versionnum },
    jquery_min_1_10_2: { url: strSite + "Js/jquery/jquery.min.1.10.2.js", version: versionnum },
 
    userCenter: { url: strSite + "Js/userCenter/userCenter.js", version: versionnum },
    userCenterBlog: { url: strSite + "Js/userCenter/userCenterBlog.js", version: versionnum },
    userCenterMood: { url: strSite + "Js/userCenter/userCenterMood.js", version: versionnum },
    userCenterCoin: { url: strSite + "Js/userCenter/userCenterCoin.js", version: versionnum },
     
    getPassword: { url: strSite + "Js/help/getPassword.js", version: versionnum },
    getAccount: { url: strSite + "Js/help/getAccount.js", version: versionnum },
    resetPassword: { url: strSite + "Js/help/resetPassword.js", version: versionnum },
    feedback: { url: strSite + "Js/help/feedback.js", version: versionnum },

    emotion: { url: strSite + "Js/main/emotion.js", version: versionnum },
    suggest: { url: strSite + "Js/main/suggest.js", version: versionnum },
    share: { url: strSite + "Js/main/share.js", version: versionnum },
    index: { url: strSite + "Js/main/index.js", version: versionnum },
    tag: { url: strSite + "Js/main/tag.js", version: versionnum },
    userMood: { url: strSite + "Js/main/userMood.js", version: versionnum },
    question: { url: strSite + "Js/main/question.js", version: versionnum }
}

function loadJS(keys) {
    if (keys) {
        for (var i = 0; i < keys.length; i++) {
            var jsnode = JSHash[keys[i]];
            document.writeln("<script type=\"text/javascript\" src=\"" + jsnode.url + "?v=" + jsnode.version + "\"></script>");
        }
    }
}