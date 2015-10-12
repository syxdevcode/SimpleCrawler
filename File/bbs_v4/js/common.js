/**
* weiphone bbs v4 common.js
* follow by discuz common.js
* kongge@office.feng.com
* 2013.08.20
*/

//ds.base
;(function(global, document, $, undefined){
	var 
	rblock = /\{([^\}]*)\}/g,
	ds = global.ds = {
		noop: function(){},
		//Object
		mix: function(target, source, cover){
			if(typeof source !== 'object'){
				cover = source;
				source = target;
				target = this;
			}
			for(var k in source){
				if(cover || target[k] === undefined){
					target[k] = source[k];
				}
			}
			return target;
		},
		//BOM
		scrollTo: (function(){
			var 
			duration = 480,
			view = $(global),
			setTop = function(top){ global.scrollTo(0, top);},
			fxEase = function(t){return (t*=2)<1?.5*t*t:.5*(1-(--t)*(t-2));};
			return function(top, callback){
				top = Math.max(0, ~~top);
				var 
				tMark = new Date(),
				currTop = view.scrollTop(),
				height = top - currTop,
				fx = function(){
					var tMap = new Date() - tMark;
					if(tMap >= duration){
						setTop(top);
						return (callback || ds.noop).call(ds, top);
					}
					setTop(currTop + height * fxEase(tMap/duration));
					setTimeout(fx, 16);
				};
				fx();
			};
		})(),
		//lazyResize, sleep 160ms
		lazyResize: (function(){
			var timer, c = 0, bound = false, callbacks = [];
			function fireCallbacks(){
				c++;
				for(var i=0,len=callbacks.length; i<len; i++){
					callbacks[i].call(global, c);
				}
			}
			function bind(){
				bound = true;
				jQuery(global).bind('resize.lazyresize', function(){
					clearTimeout(timer);
					timer = setTimeout(fireCallbacks, 160);
				});
			}
			return function(callback){
				if(typeof callback === 'function'){
					callbacks.push(callback);
					
					!bound && bind();
				}
			};
		})(),
		//DOM
		loadScriptCache: {},
		loadScript: function(url, callback, args){
			var cache = this.loadScriptCache[url];
			if(!cache){
				cache = this.loadScriptCache[url] = {
					callbacks: [],
					url: url
				};

				var 
				firstScript = document.getElementsByTagName('script')[0],
				script = document.createElement('script');
				if(typeof args === 'object'){
					for(var k in args){
						script[k] = args[k];
					}
				}
				script.src = url;
				script.onload = script.onreadystatechange = 
				script.onerror = function(){
					if(/undefined|loaded|complete/.test(this.readyState)){
						script = script.onreadystatechange = 
						script.onload = script.onerror = null;
						cache.loaded = true;
						
						for(var i=0,len=cache.callbacks.length; i<len; i++){
							cache.callbacks[i].call(null, url);
						}
						cache.callbacks = [];
					}
				};
				firstScript.parentNode.insertBefore(script, firstScript);
			}

			if(!cache.loaded){
				if(typeof callback === 'function'){
					cache.callbacks.push(callback);
				}
			}
			else{
				(callback || ds.noop).call(null, url);
			}
			return this;
		},
		requestAnimationFrame: (function(){
			var handler = global.requestAnimationFrame || global.webkitRequestAnimationFrame || 
				global.mozRequestAnimationFrame || global.msRequestAnimationFrame || 
				global.oRequestAnimationFrame || function(callback){
					return global.setTimeout(callback, 1000 / 60);
				};
			return function(callback){
				return handler(callback);
			};
		})(),
		animate: (function(){
			var 
			easeOut = function(pos){ return (Math.pow((pos - 1), 3) + 1);};
			getCurrCSS = global.getComputedStyle ? function(elem, name){
				return global.getComputedStyle(elem, null)[name];
			} : function(elem, name){
				return elem.currentStyle[name];
			};
			return function(elem, name, to, duration, callback, easing){
				var 
				from = parseFloat(getCurrCSS(elem, name)) || 0,
				style = elem.style,
				tMark = new Date(),
				size = 0;
				function fx(){
					var elapsed = +new Date() - tMark;
					if(elapsed >= duration){
						style[name] = to + 'px';
						return (callback || ds.noop).call(elem);
					}
					style[name] = (from + size * easing(elapsed/duration)) + 'px';
					ds.requestAnimationFrame(fx);
				};
				to = parseFloat(to) || 0;
				duration = ~~duration || 200;
				easing = easing || easeOut;
				size = to - from;
				fx();
				return this;
			};
		})(),
		//Cookies
		getCookie: function(name){
			var ret = new RegExp('(?:^|[^;])' + name + '=([^;]+)').exec(document.cookie);
			return ret ? decodeURIComponent(ret[1]) : '';
		},
		setCookie: function(name, value, expir){
			var cookie = name + '=' + encodeURIComponent(value);
			if(expir !== void 0){
				var now = new Date();
				now.setDate(now.getDate() + ~~expir);
				cookie += '; expires=' + now.toGMTString();
			}
			document.cookie = cookie;
		},
		//Hacker
		isIE6: !-[1,] && !global.XMLHttpRequest
	};
	//CSS3 Hacker
	ds.mix((function(){
		var 
		j, name,
		hack = {},
		props = ['transform', 'transition'],
		prefixs = ['o', 'ms', 'moz', 'webkit', ''],
		docStyle = (document.documentElement || document.body).style;
		for(var i=props.length-1; i>=0; i--){
			for(j=prefixs.length-1; j>=0; j--){
				name = prefixs[j] + (prefixs[j] ? props[i].slice(0, 1).toUpperCase()+props[i].slice(1) : props[i]);
				if((name in docStyle)){
					hack[props[i] + 'Support'] = {
						prefix: prefixs[j],
						propName: name
					};
					break;
				}
			}
		}
		return hack;
	})());
})(this, document, jQuery);

//base extends ds/jQuery
jQuery.easing.easeOutQuart = function(x, t, b, c, d){ return -c * ((t=t/d-1)*t*t*t - 1) + b; };
jQuery.easing.easeOutBack = function(x, t, b, c, d, s){ if (s == undefined) s = 1.70158; return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;};


/** follow discuz common.js **/

//HTMLNODE
var HTMLNODE = document.documentElement;

//browser
(function($){
	var ver, other = 1,
	browser = window.BROWSER = {},
	uastr = navigator.userAgent.toLowerCase(),
	types = {ie:'msie',firefox:'',chrome:'',opera:'',safari:'',mozilla:'',webkit:'',maxthon:'',qq:'qqbrowser',rv:'rv'};
	for(var k in types){
		ver = 0;
		if(new RegExp((types[k] || k) + '(?:\\/|\\s|:)([\\d\\.]+)', 'ig').test(uastr)){
			ver = RegExp.$1;
			other = 0;
		}
		browser[k] = ver;
	}
	if(browser.opera && window.opera){
		browser.opera = opera.version();
	}
	browser.other = other;

	//ie extends
	if(browser.ie){
		browser.iemode = parseInt(document.documentMode || browser.ie, 10) || 0;
		jQuery(function(){
			jQuery(document.body).addClass('ie_all ie' + browser.iemode);
		});

		try{
			HTMLNODE.addBehavior("#default#userdata");
		}
		catch(_){}
	}

	//CSS3 Extends
	var docClassName = HTMLNODE.className, docClassList = [];
	if(docClassName){
		docClassList.push(docClassName);
	}
	if(ds.transitionSupport){
		docClassList.push('transition');
	}
	if(ds.transformSupport){
		docClassList.push('transform');
	}
	HTMLNODE.className = docClassList.join(' ');
})(jQuery);


var CSSLOADED = [];
var JSLOADED = [];
var JSMENU = [];
JSMENU['active'] = [];
JSMENU['timer'] = [];
JSMENU['drag'] = [];
JSMENU['layer'] = 0;
JSMENU['zIndex'] = {'win':200,'menu':300,'dialog':400,'prompt':500};
JSMENU['float'] = '';
var CURRENTSTYPE = null;
var discuz_uid = isUndefined(discuz_uid) ? 0 : discuz_uid;
var creditnotice = isUndefined(creditnotice) ? '' : creditnotice;
var cookiedomain = isUndefined(cookiedomain) ? '' : cookiedomain;
var cookiepath = isUndefined(cookiepath) ? '' : cookiepath;
var EXTRAFUNC = [], EXTRASTR = '';
EXTRAFUNC['showmenu'] = [];

var DISCUZCODE = [];
DISCUZCODE['num'] = '-1';
DISCUZCODE['html'] = [];

var USERABOUT_BOX = true;
var USERCARDST = null;
var CLIPBOARDSWFDATA = '';
var NOTICETITLE = [];
var NOTICECURTITLE = document.title;

if(BROWSER.firefox && window.HTMLElement) {
	HTMLElement.prototype.__defineGetter__( "innerText", function(){
		var anyString = "";
		var childS = this.childNodes;
		for(var i=0; i <childS.length; i++) {
			if(childS[i].nodeType==1) {
				anyString += childS[i].tagName=="BR" ? '\n' : childS[i].innerText;
			} else if(childS[i].nodeType==3) {
				anyString += childS[i].nodeValue;
			}
		}
		return anyString;
	});
	HTMLElement.prototype.__defineSetter__( "innerText", function(sText){
		this.textContent=sText;
	});
	HTMLElement.prototype.__defineSetter__('outerHTML', function(sHTML) {
			var r = this.ownerDocument.createRange();
		r.setStartBefore(this);
		var df = r.createContextualFragment(sHTML);
		this.parentNode.replaceChild(df,this);
		return sHTML;
	});

	HTMLElement.prototype.__defineGetter__('outerHTML', function() {
		var attr;
		var attrs = this.attributes;
		var str = '<' + this.tagName.toLowerCase();
		for(var i = 0;i < attrs.length;i++){
			attr = attrs[i];
			if(attr.specified)
			str += ' ' + attr.name + '="' + attr.value + '"';
		}
		if(!this.canHaveChildren) {
			return str + '>';
		}
		return str + '>' + this.innerHTML + '</' + this.tagName.toLowerCase() + '>';
		});

	HTMLElement.prototype.__defineGetter__('canHaveChildren', function() {
		switch(this.tagName.toLowerCase()) {
			case 'area':case 'base':case 'basefont':case 'col':case 'frame':case 'hr':case 'img':case 'br':case 'input':case 'isindex':case 'link':case 'meta':case 'param':
			return false;
			}
		return true;
	});
}

function $(id) {
	return !id ? null : document.getElementById(id);
}

function $C(classname, ele, tag) {
	var returns = [];
	ele = ele || document;
	tag = tag || '*';
	if(ele.getElementsByClassName) {
		var eles = ele.getElementsByClassName(classname);
		if(tag != '*') {
			for (var i = 0, L = eles.length; i < L; i++) {
				if (eles[i].tagName.toLowerCase() == tag.toLowerCase()) {
						returns.push(eles[i]);
				}
			}
		} else {
			returns = eles;
		}
	}else {
		eles = ele.getElementsByTagName(tag);
		var pattern = new RegExp("(^|\\s)"+classname+"(\\s|$)");
		for (i = 0, L = eles.length; i < L; i++) {
				if (pattern.test(eles[i].className)) {
						returns.push(eles[i]);
				}
		}
	}
	return returns;
}

function _attachEvent(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if(obj.addEventListener) {
		obj.addEventListener(evt, func, false);
	} else if(eventobj.attachEvent) {
		obj.attachEvent('on' + evt, func);
	}
}

function _detachEvent(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if(obj.removeEventListener) {
		obj.removeEventListener(evt, func, false);
	} else if(eventobj.detachEvent) {
		obj.detachEvent('on' + evt, func);
	}
}

function getEvent() {
	if(document.all) return window.event;
	func = getEvent.caller;
	while(func != null) {
		var arg0 = func.arguments[0];
		if (arg0) {
			if((arg0.constructor  == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
				return arg0;
			}
		}
		func=func.caller;
	}
	return null;
}

function isUndefined(variable) {
	return typeof variable == 'undefined' ? true : false;
}

function in_array(needle, haystack) {
	if(typeof needle == 'string' || typeof needle == 'number') {
		for(var i in haystack) {
			if(haystack[i] == needle) {
					return true;
			}
		}
	}
	return false;
}

function trim(str) {
	return (str + '').replace(/(\s+)$/g, '').replace(/^\s+/g, '');
}

function strlen(str) {
	return (BROWSER.ie && str.indexOf('\n') != -1) ? str.replace(/\r?\n/g, '_').length : str.length;
}

function mb_strlen(str) {
	var len = 0;
	for(var i = 0; i < str.length; i++) {
		len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;
	}
	return len;
}

function mb_cutstr(str, maxlen, dot) {
	var len = 0;
	var ret = '';
	var dot = !dot ? '...' : dot;
	maxlen = maxlen - dot.length;
	for(var i = 0; i < str.length; i++) {
		len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;
		if(len > maxlen) {
			ret += dot;
			break;
		}
		ret += str.substr(i, 1);
	}
	return ret;
}

function preg_replace(search, replace, str, regswitch) {
	var regswitch = !regswitch ? 'ig' : regswitch;
	var len = search.length;
	for(var i = 0; i < len; i++) {
		re = new RegExp(search[i], regswitch);
		str = str.replace(re, typeof replace == 'string' ? replace : (replace[i] ? replace[i] : replace[0]));
	}
	return str;
}

function htmlspecialchars(str) {
	return preg_replace(['&', '<', '>', '"'], ['&amp;', '&lt;', '&gt;', '&quot;'], str);
}

function display(id) {
	var obj = $(id);
	if(obj.style.visibility) {
		obj.style.visibility = obj.style.visibility == 'visible' ? 'hidden' : 'visible';
	} else {
		obj.style.display = obj.style.display == '' ? 'none' : '';
	}
}

function checkall(form, prefix, checkall) {
	var checkall = checkall ? checkall : 'chkall';
	count = 0;
	for(var i = 0; i < form.elements.length; i++) {
		var e = form.elements[i];
		if(e.name && e.name != checkall && !e.disabled && (!prefix || (prefix && e.name.match(prefix)))) {
			e.checked = form.elements[checkall].checked;
			if(e.checked) {
				count++;
			}
		}
	}
	return count;
}

function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
	if(cookieValue == '' || seconds < 0) {
		cookieValue = '';
		seconds = -2592000;
	}
	if(seconds) {
		var expires = new Date();
		expires.setTime(expires.getTime() + seconds * 1000);
	}
	domain = !domain ? cookiedomain : domain;
	path = !path ? cookiepath : path;
	document.cookie = escape(cookiepre + cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '/')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
}

function getcookie(name, nounescape) {
	name = cookiepre + name;
	var cookie_start = document.cookie.indexOf(name);
	var cookie_end = document.cookie.indexOf(";", cookie_start);
	if(cookie_start == -1) {
		return '';
	} else {
		var v = document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length));
		return !nounescape ? unescape(v) : v;
	}
}

function Ajax(recvType, waitId) {

	var aj = new Object();

	aj.loading = '请稍候...';
	aj.recvType = recvType ? recvType : 'XML';
	aj.waitId = waitId ? $(waitId) : null;

	aj.resultHandle = null;
	aj.sendString = '';
	aj.targetUrl = '';

	aj.setLoading = function(loading) {
		if(typeof loading !== 'undefined' && loading !== null) aj.loading = loading;
	};

	aj.setRecvType = function(recvtype) {
		aj.recvType = recvtype;
	};

	aj.setWaitId = function(waitid) {
		aj.waitId = typeof waitid == 'object' ? waitid : $(waitid);
	};

	aj.createXMLHttpRequest = function() {
		var request = false;
		if(window.XMLHttpRequest) {
			request = new XMLHttpRequest();
			if(request.overrideMimeType) {
				request.overrideMimeType('text/xml');
			}
		} else if(window.ActiveXObject) {
			var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
			for(var i=0; i<versions.length; i++) {
				try {
					request = new ActiveXObject(versions[i]);
					if(request) {
						return request;
					}
				} catch(e) {}
			}
		}
		return request;
	};

	aj.XMLHttpRequest = aj.createXMLHttpRequest();
	aj.showLoading = function() {
		if(aj.waitId && (aj.XMLHttpRequest.readyState != 4 || aj.XMLHttpRequest.status != 200)) {
			aj.waitId.style.display = '';
			aj.waitId.innerHTML = '<span><img src="' + IMGDIR + '/loading.gif" class="vm"> ' + aj.loading + '</span>';
		}
	};

	aj.processHandle = function() {
		if(aj.XMLHttpRequest.readyState == 4 && aj.XMLHttpRequest.status == 200) {
			if(aj.waitId) {
				aj.waitId.style.display = 'none';
			}
			if(aj.recvType == 'HTML') {
				aj.resultHandle(aj.XMLHttpRequest.responseText, aj);
			} else if(aj.recvType == 'XML') {
				if(!aj.XMLHttpRequest.responseXML || !aj.XMLHttpRequest.responseXML.lastChild || aj.XMLHttpRequest.responseXML.lastChild.localName == 'parsererror') {
					aj.resultHandle('<a href="' + aj.targetUrl + '" target="_blank" style="color:red">内部错误，无法显示此内容</a>' , aj);
				} else {
					aj.resultHandle(aj.XMLHttpRequest.responseXML.lastChild.firstChild.nodeValue, aj);
				}
			} else if(aj.recvType == 'JSON') {
				var s = null;
				try {
					s = (new Function("return ("+aj.XMLHttpRequest.responseText+")"))();
				} catch (e) {
					s = null;
				}
				aj.resultHandle(s, aj);
			}
		}
	};

	aj.get = function(targetUrl, resultHandle) {
		targetUrl = hostconvert(targetUrl);
		setTimeout(function(){aj.showLoading()}, 250);
		aj.targetUrl = targetUrl;
		aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
		aj.resultHandle = resultHandle;
		var attackevasive = isUndefined(attackevasive) ? 0 : attackevasive;
		if(window.XMLHttpRequest) {
			aj.XMLHttpRequest.open('GET', aj.targetUrl);
			aj.XMLHttpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			aj.XMLHttpRequest.send(null);
		} else {
			aj.XMLHttpRequest.open("GET", targetUrl, true);
			aj.XMLHttpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			aj.XMLHttpRequest.send();
		}
	};
	aj.post = function(targetUrl, sendString, resultHandle) {
		targetUrl = hostconvert(targetUrl);
		setTimeout(function(){aj.showLoading()}, 250);
		aj.targetUrl = targetUrl;
		aj.sendString = sendString;
		aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
		aj.resultHandle = resultHandle;
		aj.XMLHttpRequest.open('POST', targetUrl);
		aj.XMLHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		aj.XMLHttpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		aj.XMLHttpRequest.send(aj.sendString);
	};
	aj.getJSON = function(targetUrl, resultHandle) {
		aj.setRecvType('JSON');
		aj.get(targetUrl+'&ajaxdata=json', resultHandle);
	};
	aj.getHTML = function(targetUrl, resultHandle) {
		aj.setRecvType('HTML');
		aj.get(targetUrl+'&ajaxdata=html', resultHandle);
	};
	return aj;
}

function getHost(url) {
	var host = "null";
	if(typeof url == "undefined"|| null == url) {
		url = window.location.href;
	}
	var regex = /^\w+\:\/\/([^\/]*).*/;
	var match = url.match(regex);
	if(typeof match != "undefined" && null != match) {
		host = match[1];
	}
	return host;
}

function hostconvert(url) {
	if(!url.match(/^https?:\/\//)) url = SITEURL + url;
	var url_host = getHost(url);
	var cur_host = getHost().toLowerCase();
	if(url_host && cur_host != url_host) {
		url = url.replace(url_host, cur_host);
	}
	return url;
}

function newfunction(func) {
	var args = [];
	for(var i=1; i<arguments.length; i++) args.push(arguments[i]);
	return function(event) {
		doane(event);
		window[func].apply(window, args);
		return false;
	}
}

function evalscript(s) {
	if(s.indexOf('<script') == -1) return s;
	var p = /<script[^\>]*?>([^\x00]*?)<\/script>/ig;
	var arr = [];
	while(arr = p.exec(s)) {
		var p1 = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/i;
		var arr1 = [];
		arr1 = p1.exec(arr[0]);
		if(arr1) {
			appendscript(arr1[1], '', arr1[2], arr1[3]);
		} else {
			p1 = /<script(.*?)>([^\x00]+?)<\/script>/i;
			arr1 = p1.exec(arr[0]);
			appendscript('', arr1[2], arr1[1].indexOf('reload=') != -1);
		}
	}
	return s;
}

var safescripts = {}, evalscripts = [];
function safescript(id, call, seconds, times, timeoutcall, endcall, index) {
	seconds = seconds || 1000;
	times = times || 0;
	var checked = true;
	try {
		if(typeof call == 'function') {
			call();
		} else {
			eval(call);
		}
	} catch(e) {
		checked = false;
	}
	if(!checked) {
		if(!safescripts[id] || !index) {
			safescripts[id] = safescripts[id] || [];
			safescripts[id].push({
				'times':0,
				'si':setInterval(function () {
					safescript(id, call, seconds, times, timeoutcall, endcall, safescripts[id].length);
				}, seconds)
			});
		} else {
			index = (index || 1) - 1;
			safescripts[id][index]['times']++;
			if(safescripts[id][index]['times'] >= times) {
				clearInterval(safescripts[id][index]['si']);
				if(typeof timeoutcall == 'function') {
					timeoutcall();
				} else {
					eval(timeoutcall);
				}
			}
		}
	} else {
		try {
			index = (index || 1) - 1;
			if(safescripts[id][index]['si']) {
				clearInterval(safescripts[id][index]['si']);
			}
			if(typeof endcall == 'function') {
				endcall();
			} else {
				eval(endcall);
			}
		} catch(e) {}
	}
}

function $F(func, args, script) {
	var run = function () {
		var argc = args.length, s = '';
		for(i = 0;i < argc;i++) {
			s += ',args[' + i + ']';
		}
		eval('var check = typeof ' + func + ' == \'function\'');
		if(check) {
			eval(func + '(' + s.substr(1) + ')');
		} else {
			setTimeout(function () {checkrun();}, 50);
		}
	};
	var checkrun = function () {
		if(JSLOADED[src]) {
			run();
		} else {
			setTimeout(function () {checkrun();}, 50);
		}
	};
	script = script || 'common_extra';
	src = JSPATH + script + '.js?' + VERHASH;
	if(!JSLOADED[src]) {
		appendscript(src);
	}
	checkrun();
}

function appendscript(src, text, reload, charset) {
	var id = hash(src + text);
	if(!reload && in_array(id, evalscripts)) return;
	if(reload && $(id)) {
		$(id).parentNode.removeChild($(id));
	}

	evalscripts.push(id);
	var scriptNode = document.createElement("script");
	scriptNode.type = "text/javascript";
	scriptNode.id = id;
	scriptNode.charset = charset ? charset : (BROWSER.firefox ? document.characterSet : document.charset);
	try {
		if(src) {
			scriptNode.src = src;
			scriptNode.onloadDone = false;
			scriptNode.onload = function () {
				scriptNode.onloadDone = true;
				JSLOADED[src] = 1;
			};
			scriptNode.onreadystatechange = function () {
				if((scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') && !scriptNode.onloadDone) {
					scriptNode.onloadDone = true;
					JSLOADED[src] = 1;
				}
			};
		} else if(text){
			scriptNode.text = text;
		}
		document.getElementsByTagName('head')[0].appendChild(scriptNode);
	} catch(e) {}
}

function stripscript(s) {
	return s.replace(/<script.*?>.*?<\/script>/ig, '');
}

function ajaxupdateevents(obj, tagName) {
	tagName = tagName ? tagName : 'A';
	var objs = obj.getElementsByTagName(tagName);
	for(k in objs) {
		var o = objs[k];
		ajaxupdateevent(o);
	}
}

function ajaxupdateevent(o) {
	if(typeof o == 'object' && o.getAttribute) {
		if(o.getAttribute('ajaxtarget')) {
			if(!o.id) o.id = Math.random();
			var ajaxevent = o.getAttribute('ajaxevent') ? o.getAttribute('ajaxevent') : 'click';
			var ajaxurl = o.getAttribute('ajaxurl') ? o.getAttribute('ajaxurl') : o.href;
			_attachEvent(o, ajaxevent, newfunction('ajaxget', ajaxurl, o.getAttribute('ajaxtarget'), o.getAttribute('ajaxwaitid'), o.getAttribute('ajaxloading'), o.getAttribute('ajaxdisplay')));
			if(o.getAttribute('ajaxfunc')) {
				o.getAttribute('ajaxfunc').match(/(\w+)\((.+?)\)/);
				_attachEvent(o, ajaxevent, newfunction(RegExp.$1, RegExp.$2));
			}
		}
	}
}

function ajaxget(url, showid, waitid, loading, display, recall) {
	waitid = typeof waitid == 'undefined' || waitid === null ? showid : waitid;
	var x = new Ajax();
	x.setLoading(loading);
	x.setWaitId(waitid);
	x.display = typeof display == 'undefined' || display == null ? '' : display;
	x.showId = $(showid);

	if(url.substr(strlen(url) - 1) == '#') {
		url = url.substr(0, strlen(url) - 1);
		x.autogoto = 1;
	}

	var url = url + '&inajax=1&ajaxtarget=' + showid;
	x.get(url, function(s, x) {
		var evaled = false;
		if(s.indexOf('ajaxerror') != -1) {
			evalscript(s);
			evaled = true;
		}
		if(!evaled && (typeof ajaxerror == 'undefined' || !ajaxerror)) {
			if(x.showId) {
				x.showId.style.display = x.display;
				ajaxinnerhtml(x.showId, s);
				ajaxupdateevents(x.showId);
				if(x.autogoto) scroll(0, x.showId.offsetTop);
			}
		}

		ajaxerror = null;
		if(recall && typeof recall == 'function') {
			recall();
		} else if(recall) {
			eval(recall);
		}
		if(!evaled) evalscript(s);
	});
}

function ajaxpost(formid, showid, waitid, showidclass, submitbtn, recall) {
	var waitid = typeof waitid == 'undefined' || waitid === null ? showid : (waitid !== '' ? waitid : '');
	var showidclass = !showidclass ? '' : showidclass;
	var ajaxframeid = 'ajaxframe';
	var ajaxframe = $(ajaxframeid);
	var curform = $(formid);
	var formtarget = curform.target;

	var handleResult = function() {
		var s = '';
		var evaled = false;

		showloading('none');
		try{
			var elem = $(ajaxframeid).contentWindow.document;
			elem = elem.XMLDocument || elem.documentElement.firstChild;
			s = elem.text || elem.wholeText || elem.nodeValue || '';
		}
		catch(_){
			s = '内部错误，无法显示此内容';
		}

		if(s && s.indexOf('ajaxerror') != -1) {
			evalscript(s);
			evaled = true;
		}
		if(showidclass) {
			if(showidclass != 'onerror') {
				$(showid).className = showidclass;
			} else {
				showError(s);
				ajaxerror = true;
			}
		}
		if(submitbtn) {
			submitbtn.disabled = false;
		}
		if(!evaled && (typeof ajaxerror == 'undefined' || !ajaxerror)) {
			ajaxinnerhtml($(showid), s);
		}
		ajaxerror = null;
		if(curform) curform.target = formtarget;
		if(typeof recall == 'function') {
			recall();
		} else {
			eval(recall);
		}
		if(!evaled) evalscript(s);
		ajaxframe.loading = 0;
		if(!BROWSER.firefox || BROWSER.safari) {
			$('append_parent').removeChild(ajaxframe.parentNode);
		} else {
			setTimeout(
				function(){
					$('append_parent').removeChild(ajaxframe.parentNode);
				},
				100
			);
		}
	};
	if(!ajaxframe) {
		var div = document.createElement('div');
		div.style.display = 'none';
		div.innerHTML = '<iframe name="' + ajaxframeid + '" id="' + ajaxframeid + '" loading="1"></iframe>';
		$('append_parent').appendChild(div);
		ajaxframe = $(ajaxframeid);
	} else if(ajaxframe.loading) {
		return false;
	}

	_attachEvent(ajaxframe, 'load', handleResult);

	showloading();
	curform.target = ajaxframeid;
	var action = curform.getAttribute('action');
	action = hostconvert(action);
	curform.action = action.replace(/\&inajax\=1/g, '')+'&inajax=1';
	curform.submit();
	if(submitbtn) {
		submitbtn.disabled = true;
	}
	doane();
	return false;
}

function ajaxmenu(ctrlObj, timeout, cache, duration, pos, recall, idclass, contentclass) {
	if(!ctrlObj.getAttribute('mid')) {
		var ctrlid = ctrlObj.id;
		if(!ctrlid) {
			ctrlObj.id = 'ajaxid_' + Math.random();
		}
	} else {
		var ctrlid = ctrlObj.getAttribute('mid');
		if(!ctrlObj.id) {
			ctrlObj.id = 'ajaxid_' + Math.random();
		}
	}
	var menuid = ctrlid + '_menu';
	var menu = $(menuid);
	if(isUndefined(timeout)) timeout = 3000;
	if(isUndefined(cache)) cache = 1;
	if(isUndefined(pos)) pos = '43';
	if(isUndefined(duration)) duration = timeout > 0 ? 0 : 3;
	if(isUndefined(idclass)) idclass = 'p_pop';
	if(isUndefined(contentclass)) contentclass = 'p_opt';
	var func = function() {
		showMenu({'ctrlid':ctrlObj.id,'menuid':menuid,'duration':duration,'timeout':timeout,'pos':pos,'cache':cache,'layer':2});
		if(typeof recall == 'function') {
			recall();
		} else {
			eval(recall);
		}
	};

	if(menu) {
		if(menu.style.display == '') {
			hideMenu(menuid);
		} else {
			func();
		}
	} else {
		menu = document.createElement('div');
		menu.id = menuid;
		menu.style.display = 'none';
		menu.className = idclass;
		menu.innerHTML = '<div class="' + contentclass + '" id="' + menuid + '_content"></div>';
		$('append_parent').appendChild(menu);
		var url = (!isUndefined(ctrlObj.attributes['shref']) ? ctrlObj.attributes['shref'].value : (!isUndefined(ctrlObj.href) ? ctrlObj.href : ctrlObj.attributes['href'].value));
		url += (url.indexOf('?') != -1 ? '&' :'?') + 'ajaxmenu=1';
		ajaxget(url, menuid + '_content', 'ajaxwaitid', '', '', func);
	}
	doane();
}

function hash(string, length) {
	var length = length ? length : 32;
	var start = 0;
	var i = 0;
	var result = '';
	filllen = length - string.length % length;
	for(i = 0; i < filllen; i++){
		string += "0";
	}
	while(start < string.length) {
		result = stringxor(result, string.substr(start, length));
		start += length;
	}
	return result;
}

function stringxor(s1, s2) {
	var s = '';
	var hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var max = Math.max(s1.length, s2.length);
	for(var i=0; i<max; i++) {
		var k = s1.charCodeAt(i) ^ s2.charCodeAt(i);
		s += hash.charAt(k % 52);
	}
	return s;
}

function showPreview(val, id) {
	var showObj = $(id);
	if(showObj) {
		showObj.innerHTML = val.replace(/\n/ig, "<bupdateseccoder />");
	}
}

function showloading(display, waiting) {
	var display = display ? display : 'block';
	var waiting = waiting ? waiting : '请稍候...';
	$('ajaxwaitid').innerHTML = waiting;
	$('ajaxwaitid').style.display = display;
	if($('ajaxwaitid_post')){
		$('ajaxwaitid_post').innerHTML = '正在提交中...';
		$('ajaxwaitid_post').style.display = display;
	}
}

function ajaxinnerhtml(showid, s) {
	if(showid.tagName != 'TBODY') {
		showid.innerHTML = s;
	} else {
		while(showid.firstChild) {
			showid.firstChild.parentNode.removeChild(showid.firstChild);
		}
		var div1 = document.createElement('DIV');
		div1.id = showid.id+'_div';
		div1.innerHTML = '<table><tbody id="'+showid.id+'_tbody">'+s+'</tbody></table>';
		$('append_parent').appendChild(div1);
		var trs = div1.getElementsByTagName('TR');
		var l = trs.length;
		for(var i=0; i<l; i++) {
			showid.appendChild(trs[0]);
		}
		var inputs = div1.getElementsByTagName('INPUT');
		var l = inputs.length;
		for(var i=0; i<l; i++) {
			showid.appendChild(inputs[0]);
		}
		div1.parentNode.removeChild(div1);
	}
}

function doane(event, preventDefault, stopPropagation) {
	var preventDefault = isUndefined(preventDefault) ? 1 : preventDefault;
	var stopPropagation = isUndefined(stopPropagation) ? 1 : stopPropagation;
	e = event ? event : window.event;
	if(!e) {
		e = getEvent();
	}
	if(!e) {
		return null;
	}
	if(preventDefault) {
		if(e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}
	if(stopPropagation) {
		if(e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	}
	return e;
}

function loadcss(cssname) {
	if(!CSSLOADED[cssname]) {
		if(!$('css_' + cssname)) {
			css = document.createElement('link');
			css.id = 'css_' + cssname,
			css.type = 'text/css';
			css.rel = 'stylesheet';
			css.href = 'data/cache/style_' + STYLEID + '_' + cssname + '.css?' + VERHASH;
			var headNode = document.getElementsByTagName("head")[0];
			headNode.appendChild(css);
		} else {
			$('css_' + cssname).href = 'data/cache/style_' + STYLEID + '_' + cssname + '.css?' + VERHASH;
		}
		CSSLOADED[cssname] = 1;
	}
}

function showMenu(v) {
	var ctrlid = isUndefined(v['ctrlid']) ? v : v['ctrlid'];
	var showid = isUndefined(v['showid']) ? ctrlid : v['showid'];
	var menuid = isUndefined(v['menuid']) ? showid + '_menu' : v['menuid'];
	var ctrlObj = $(ctrlid);
	var menuObj = $(menuid);
	if(!menuObj) return;
	var mtype = isUndefined(v['mtype']) ? 'menu' : v['mtype'];
	var evt = isUndefined(v['evt']) ? 'mouseover' : v['evt'];
	var pos = isUndefined(v['pos']) ? '43' : v['pos'];
	var layer = isUndefined(v['layer']) ? 1 : v['layer'];
	var duration = isUndefined(v['duration']) ? 2 : v['duration'];
	var timeout = isUndefined(v['timeout']) ? 250 : v['timeout'];
	var maxh = isUndefined(v['maxh']) ? 600 : v['maxh'];
	var cache = isUndefined(v['cache']) ? 1 : v['cache'];
	var drag = isUndefined(v['drag']) ? '' : v['drag'];
	var dragobj = drag && $(drag) ? $(drag) : menuObj;
	var fade = isUndefined(v['fade']) ? 0 : v['fade'];
	var cover = isUndefined(v['cover']) ? 0 : v['cover'];
	var zindex = isUndefined(v['zindex']) ? JSMENU['zIndex']['menu'] : v['zindex'];
	var ctrlclass = isUndefined(v['ctrlclass']) ? '' : v['ctrlclass'];
	var winhandlekey = isUndefined(v['win']) ? '' : v['win'];
	zindex = cover ? zindex + 500 : zindex;
	if(typeof JSMENU['active'][layer] == 'undefined') {
		JSMENU['active'][layer] = [];
	}

	for(i in EXTRAFUNC['showmenu']) {
		try {
			eval(EXTRAFUNC['showmenu'][i] + '()');
		} catch(e) {}
	}

	if(evt == 'click' && in_array(menuid, JSMENU['active'][layer]) && mtype != 'win') {
		hideMenu(menuid, mtype);
		return;
	}
	if(mtype == 'menu') {
		hideMenu(layer, mtype);
	}

	if(ctrlObj) {
		if(!ctrlObj.getAttribute('initialized')) {
			ctrlObj.setAttribute('initialized', true);
			ctrlObj.unselectable = true;

			ctrlObj.outfunc = typeof ctrlObj.onmouseout == 'function' ? ctrlObj.onmouseout : null;
			ctrlObj.onmouseout = function() {
				if(this.outfunc) this.outfunc();
				if(duration < 3 && !JSMENU['timer'][menuid]) {
					JSMENU['timer'][menuid] = setTimeout(function () {
						hideMenu(menuid, mtype);
					}, timeout);
				}
			};

			ctrlObj.overfunc = typeof ctrlObj.onmouseover == 'function' ? ctrlObj.onmouseover : null;
			ctrlObj.onmouseover = function(e) {
				doane(e);
				if(this.overfunc) this.overfunc();
				if(evt == 'click') {
					clearTimeout(JSMENU['timer'][menuid]);
					JSMENU['timer'][menuid] = null;
				} else {
					for(var i in JSMENU['timer']) {
						if(JSMENU['timer'][i]) {
							clearTimeout(JSMENU['timer'][i]);
							JSMENU['timer'][i] = null;
						}
					}
				}
			};
		}
	}

	if(!menuObj.getAttribute('initialized')) {
		menuObj.setAttribute('initialized', true);
		menuObj.ctrlkey = ctrlid;
		menuObj.mtype = mtype;
		menuObj.layer = layer;
		menuObj.cover = cover;
		if(ctrlObj && ctrlObj.getAttribute('fwin')) {menuObj.scrolly = true;}
		menuObj.style.position = 'absolute';
		menuObj.style.zIndex = zindex + layer;
		menuObj.onclick = function(e) {
			return doane(e, 0, 1);
		};
		if(duration < 3) {
			if(duration > 1) {
				menuObj.onmouseover = function() {
					clearTimeout(JSMENU['timer'][menuid]);
					JSMENU['timer'][menuid] = null;
				};
			}
			if(duration != 1) {
				menuObj.onmouseout = function() {
					JSMENU['timer'][menuid] = setTimeout(function () {
						hideMenu(menuid, mtype);
					}, timeout);
				};
			}
		}
		if(cover) {
			var coverObj = document.createElement('div');
			coverObj.id = menuid + '_cover';
			coverObj.style.position = 'absolute';
			coverObj.style.zIndex = menuObj.style.zIndex - 1;
			coverObj.style.left = coverObj.style.top = '0px';
			coverObj.style.width = '100%';
			coverObj.style.height = Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + 'px';
			coverObj.style.backgroundColor = '#000';
			coverObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=50)';
			coverObj.style.opacity = 0.5;
			coverObj.onclick = function () {hideMenu();};
			$('append_parent').appendChild(coverObj);
			_attachEvent(window, 'load', function () {
				coverObj.style.height = Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + 'px';
			}, document);
		}
	}
	if(drag) {
		dragobj.style.cursor = 'move';
		dragobj.onmousedown = function(event) {try{dragMenu(menuObj, event, 1);}catch(e){}};
	}

	if(cover) $(menuid + '_cover').style.display = '';
	if(fade) {
		var O = 0;
		var fadeIn = function(O) {
			if(O > 100) {
				clearTimeout(fadeInTimer);
				return;
			}
			menuObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + O + ')';
			menuObj.style.opacity = O / 100;
			O += 20;
			var fadeInTimer = setTimeout(function () {
				fadeIn(O);
			}, 40);
		};
		fadeIn(O);
		menuObj.fade = true;
	} else {
		menuObj.fade = false;
	}
	menuObj.style.display = '';
	if(ctrlObj && ctrlclass) {
		ctrlObj.className += ' ' + ctrlclass;
		menuObj.setAttribute('ctrlid', ctrlid);
		menuObj.setAttribute('ctrlclass', ctrlclass);
	}
	if(pos != '*') {
		setMenuPosition(showid, menuid, pos);
	}
	if(BROWSER.ie && BROWSER.ie < 7 && winhandlekey && $('fwin_' + winhandlekey)) {
		$(menuid).style.left = (parseInt($(menuid).style.left) - parseInt($('fwin_' + winhandlekey).style.left)) + 'px';
		$(menuid).style.top = (parseInt($(menuid).style.top) - parseInt($('fwin_' + winhandlekey).style.top)) + 'px';
	}
	if(maxh && menuObj.scrollHeight > maxh) {
		menuObj.style.height = maxh + 'px';
		if(BROWSER.opera) {
			menuObj.style.overflow = 'auto';
		} else {
			menuObj.style.overflowY = 'auto';
		}
	}

	if(!duration) {
		setTimeout('hideMenu(\'' + menuid + '\', \'' + mtype + '\')', timeout);
	}

	if(!in_array(menuid, JSMENU['active'][layer])) JSMENU['active'][layer].push(menuid);
	menuObj.cache = cache;
	if(layer > JSMENU['layer']) {
		JSMENU['layer'] = layer;
	}
	var hasshow = function(ele) {
		while(ele.parentNode && ((typeof(ele['currentStyle']) === 'undefined') ? window.getComputedStyle(ele,null) : ele['currentStyle'])['display'] !== 'none') {
			ele = ele.parentNode;
		}
		if(ele === document) {
			return true;
		} else {
			return false;
		}
	};
	if(!menuObj.getAttribute('disautofocus')) {
		try{
			var focused = false;
			var tags = ['input', 'select', 'textarea', 'button', 'a'];
			for(var i = 0; i < tags.length; i++) {
				var _all = menuObj.getElementsByTagName(tags[i]);
				if(_all.length) {
					for(j = 0; j < _all.length; j++) {
						if((!_all[j]['type'] || _all[j]['type'] != 'hidden') && hasshow(_all[j])) {
							_all[j].className += ' hidefocus';
							_all[j].focus();
							focused = true;
							var cobj = _all[j];
							_attachEvent(_all[j], 'blur', function (){cobj.className = trim(cobj.className.replace(' hidefocus', ''));});
							break;
						}
					}
				}
				if(focused) {
					break;
				}
			}
		} catch (e) {
		}
	}
}
var delayShowST = null;
function delayShow(ctrlObj, call, time) {
	if(typeof ctrlObj == 'object') {
		var ctrlid = ctrlObj.id;
		call = call || function () {showMenu(ctrlid);};
	}
	var time = isUndefined(time) ? 500 : time;
	delayShowST = setTimeout(function () {
		if(typeof call == 'function') {
			call();
		} else {
			eval(call);
		}
	}, time);
	if(!ctrlObj.delayinit) {
		_attachEvent(ctrlObj, 'mouseout', function() {clearTimeout(delayShowST);});
		ctrlObj.delayinit = 1;
	}
}

//dz dragMenu
var dragMenuDisabled = false;
(function($){
	var 
	currDrag = {},
	view = $(window),
	doc = $(document),
	rnodrag = /textarea|input|button|select/i;
	function initDrag(elem, options){
		if(!(elem = $(elem)).length){ return; }
		elem.bind('mousedown.drag', function(e){
			e.preventDefault();

			var offset = elem.offset();
			currDrag.xOffset = e.pageX - offset.left;
			currDrag.yOffset = e.pageY - offset.top;
			currDrag.options = options || {};
			currDrag.elem = elem;
			doc.bind('mousemove.drag', function(e){
				e.preventDefault();
				
				var 
				style = elem[0].style,
				left = e.pageX - currDrag.xOffset,
				top = e.pageY - currDrag.yOffset;
				if(elem.css('position') === 'fixed'){
					top -= view.scrollTop();
				}
				style.left = left + 'px';
				style.top = top + 'px';
			})
			.bind('mouseup.drag', releaseDrag);
		});
	}
	function releaseDrag(){
		if(currDrag && currDrag.elem){
			doc.unbind('mousemove.drag').unbind('mouseup.drag');
			if(currDrag.options.autoReleaseDrag){
				currDrag.elem.unbind('mousedown.drag');
			}
			currDrag = {};
		}
	}
	
	ds.mix(window, {
		dragMenu: function(elem, e, op){
			//op follow dz: 1-on, 2-move, 3-off

			e = e || window.event;
			releaseDrag();
			if(!dragMenuDisabled && op != 3 && !rnodrag.test((e.target || e.srcElement).tagName)){
				initDrag(elem, {
					autoReleaseDrag: true
				});
			}
		},
		initDrag: initDrag
	});
})(jQuery);

function setMenuPosition(showid, menuid, pos) {
	var showObj = $(showid);
	var menuObj = menuid ? $(menuid) : $(showid + '_menu');
	if(isUndefined(pos) || !pos) pos = '43';
	var basePoint = parseInt(pos.substr(0, 1));
	var direction = parseInt(pos.substr(1, 1));
	var important = pos.indexOf('!') != -1 ? 1 : 0;
	var sxy = 0, sx = 0, sy = 0, sw = 0, sh = 0, ml = 0, mt = 0, mw = 0, mcw = 0, mh = 0, mch = 0, bpl = 0, bpt = 0;

	if(!menuObj || (basePoint > 0 && !showObj)) return;
	if(showObj) {
		//sxy = fetchOffset(showObj);
		sxy = window.jQuery ? jQuery(showObj).offset() : fetchOffset(showObj);
		sx = sxy['left'];
		sy = sxy['top'];
		sw = showObj.offsetWidth;
		sh = showObj.offsetHeight;
	}
	mw = menuObj.offsetWidth;
	mcw = menuObj.clientWidth;
	mh = menuObj.offsetHeight;
	mch = menuObj.clientHeight;

	switch(basePoint) {
		case 1:
			bpl = sx;
			bpt = sy;
			break;
		case 2:
			bpl = sx + sw;
			bpt = sy;
			break;
		case 3:
			bpl = sx + sw;
			bpt = sy + sh;
			break;
		case 4:
			bpl = sx;
			bpt = sy + sh;
			break;
	}
	switch(direction) {
		case 0:
			menuObj.style.left = (document.body.clientWidth - menuObj.clientWidth) / 2 + 'px';
			mt = (document.documentElement.clientHeight - menuObj.clientHeight) / 2;
			break;
		case 1:
			ml = bpl - mw;
			mt = bpt - mh;
			break;
		case 2:
			ml = bpl;
			mt = bpt - mh;
			break;
		case 3:
			ml = bpl;
			mt = bpt;
			break;
		case 4:
			ml = bpl - mw;
			mt = bpt;
			break;
	}
	var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
	var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
	if(!important) {
		if(in_array(direction, [1, 4]) && ml < 0) {
			ml = bpl;
			if(in_array(basePoint, [1, 4])) ml += sw;
		} else if(ml + mw > scrollLeft + document.body.clientWidth && sx >= mw) {
			ml = bpl - mw;
			if(in_array(basePoint, [2, 3])) {
				ml -= sw;
			} else if(basePoint == 4) {
				ml += sw;
			}
		}
		if(in_array(direction, [1, 2]) && mt < 0) {
			mt = bpt;
			if(in_array(basePoint, [1, 2])) mt += sh;
		} else if(mt + mh > scrollTop + document.documentElement.clientHeight && sy >= mh) {
			mt = bpt - mh;
			if(in_array(basePoint, [3, 4])) mt -= sh;
		}
	}
	if(pos.substr(0, 3) == '210') {
		ml += 69 - sw / 2;
		mt -= 5;
		if(showObj.tagName == 'TEXTAREA') {
			ml -= sw / 2;
			mt += sh / 2;
		}
	}
	if(direction == 0 || menuObj.scrolly) {
		if(BROWSER.ie && BROWSER.ie < 7) {
			if(direction == 0) mt += scrollTop;
		} else {
			if(menuObj.scrolly) mt -= scrollTop;
			menuObj.style.position = 'fixed';
		}
	}
	if(ml) menuObj.style.left = ml + 'px';
	if(mt) menuObj.style.top = mt + 'px';
	if(direction == 0 && BROWSER.ie && !document.documentElement.clientHeight) {
		menuObj.style.position = 'absolute';
		menuObj.style.top = (document.body.clientHeight - menuObj.clientHeight) / 2 + 'px';
	}
	if(menuObj.style.clip && !BROWSER.opera) {
		menuObj.style.clip = 'rect(auto, auto, auto, auto)';
	}
}

function hideMenu(attr, mtype) {
	attr = isUndefined(attr) ? '' : attr;
	mtype = isUndefined(mtype) ? 'menu' : mtype;
	if(attr == '') {
		for(var i = 1; i <= JSMENU['layer']; i++) {
			hideMenu(i, mtype);
		}
		return;
	} else if(typeof attr == 'number') {
		for(var j in JSMENU['active'][attr]) {
			hideMenu(JSMENU['active'][attr][j], mtype);
		}
		return;
	}else if(typeof attr == 'string') {
		var menuObj = $(attr);
		if(!menuObj || (mtype && menuObj.mtype != mtype)) return;
		var ctrlObj = '', ctrlclass = '';
		if((ctrlObj = $(menuObj.getAttribute('ctrlid'))) && (ctrlclass = menuObj.getAttribute('ctrlclass'))) {
			var reg = new RegExp(' ' + ctrlclass);
			ctrlObj.className = ctrlObj.className.replace(reg, '');
		}
		clearTimeout(JSMENU['timer'][attr]);
		var hide = function() {
			if(menuObj.cache) {
				if(menuObj.style.visibility != 'hidden') {
					menuObj.style.display = 'none';
					if(menuObj.cover) $(attr + '_cover').style.display = 'none';
				}
			}else {
				menuObj.parentNode.removeChild(menuObj);
				if(menuObj.cover) $(attr + '_cover').parentNode.removeChild($(attr + '_cover'));
			}
			var tmp = [];
			for(var k in JSMENU['active'][menuObj.layer]) {
				if(attr != JSMENU['active'][menuObj.layer][k]) tmp.push(JSMENU['active'][menuObj.layer][k]);
			}
			JSMENU['active'][menuObj.layer] = tmp;
		};
		if(menuObj.fade) {
			var O = 100;
			var fadeOut = function(O) {
				if(O == 0) {
					clearTimeout(fadeOutTimer);
					hide();
					return;
				}
				menuObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + O + ')';
				menuObj.style.opacity = O / 100;
				O -= 20;
				var fadeOutTimer = setTimeout(function () {
					fadeOut(O);
				}, 40);
			};
			fadeOut(O);
		} else {
			hide();
		}
	}
}

function getCurrentStyle(obj, cssproperty, csspropertyNS) {
	if(obj.style[cssproperty]){
		return obj.style[cssproperty];
	}
	if (obj.currentStyle) {
		return obj.currentStyle[cssproperty];
	} else if (document.defaultView.getComputedStyle(obj, null)) {
		var currentStyle = document.defaultView.getComputedStyle(obj, null);
		var value = currentStyle.getPropertyValue(csspropertyNS);
		if(!value){
			value = currentStyle[cssproperty];
		}
		return value;
	} else if (window.getComputedStyle) {
		var currentStyle = window.getComputedStyle(obj, "");
		return currentStyle.getPropertyValue(csspropertyNS);
	}
}

function fetchOffset(obj, mode) {
	var left_offset = 0, top_offset = 0, mode = !mode ? 0 : mode;

	if(obj.getBoundingClientRect && !mode) {
		var rect = obj.getBoundingClientRect();
		var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		if(document.documentElement.dir == 'rtl') {
			scrollLeft = scrollLeft + document.documentElement.clientWidth - document.documentElement.scrollWidth;
		}
		left_offset = rect.left + scrollLeft - document.documentElement.clientLeft;
		top_offset = rect.top + scrollTop - document.documentElement.clientTop;
	}
	if(left_offset <= 0 || top_offset <= 0) {
		left_offset = obj.offsetLeft;
		top_offset = obj.offsetTop;
		while((obj = obj.offsetParent) != null) {
			position = getCurrentStyle(obj, 'position', 'position');
			if(position == 'relative') {
				continue;
			}
			left_offset += obj.offsetLeft;
			top_offset += obj.offsetTop;
		}
	}
	return {'left' : left_offset, 'top' : top_offset};
}

function showTip(ctrlobj) {
	$F('_showTip', arguments);
}

function showPrompt(ctrlid, evt, msg, timeout, classname) {
	$F('_showPrompt', arguments);
}

function showCreditPrompt() {
	$F('_showCreditPrompt', []);
}

var showDialogST = null;
function showDialog(msg, mode, t, func, cover, funccancel, leftmsg, confirmtxt, canceltxt, closetime, locationtime) {
	clearTimeout(showDialogST);
	cover = isUndefined(cover) ? (mode == 'info' ? 0 : 1) : cover;
	leftmsg = isUndefined(leftmsg) ? '' : leftmsg;
	mode = in_array(mode, ['confirm', 'notice', 'info', 'right']) ? mode : 'alert';
	var menuid = 'fwin_dialog';
	var menuObj = $(menuid);
	var showconfirm = 1;
	confirmtxtdefault = '确定';
	closetime = isUndefined(closetime) ? '' : closetime;
	closefunc = function () {
		if(typeof func == 'function') func();
		else eval(func);
		hideMenu(menuid, 'dialog');
	};
	if(closetime) {
		showPrompt(null, null, '<i>' + msg + '</i>', closetime * 1000, 'popuptext');
		return;
	}
	locationtime = isUndefined(locationtime) ? '' : locationtime;
	if(locationtime) {
		leftmsg = locationtime + ' 秒后页面跳转';
		showDialogST = setTimeout(closefunc, locationtime * 1000);
		showconfirm = 0;
	}
	confirmtxt = confirmtxt ? confirmtxt : confirmtxtdefault;
	canceltxt = canceltxt ? canceltxt : '取消';

	if(menuObj) hideMenu('fwin_dialog', 'dialog');
	menuObj = document.createElement('div');
	menuObj.style.display = 'none';
	menuObj.className = 'fwinmask';
	menuObj.id = menuid;
	$('append_parent').appendChild(menuObj);
	var hidedom = '';
	if(!BROWSER.ie) {
		hidedom = '<style type="text/css">object{visibility:hidden;}</style>';
	}
	var s = hidedom + '<table cellpadding="0" cellspacing="0" class="fwin"><tr><td class="t_l"></td><td class="t_c"></td><td class="t_r"></td></tr><tr><td class="m_l">&nbsp;&nbsp;</td><td class="m_c"><h3 class="flb"><em>';
	s += t ? t : '提示信息';
	s += '</em><span><a href="javascript:;" id="fwin_dialog_close" class="flbc" onclick="hideMenu(\'' + menuid + '\', \'dialog\')" title="关闭">关闭</a></span></h3>';
	if(mode == 'info') {
		s += msg ? msg : '';
	} else {
		s += '<div class="c altw"><div class="' + (mode == 'alert' ? 'alert_error' : (mode == 'right' ? 'alert_right' : 'alert_info')) + '"><p>' + msg + '</p></div></div>';
		s += '<p class="o pns">' + (leftmsg ? '<span class="z xg1">' + leftmsg + '</span>' : '') + (showconfirm ? '<button id="fwin_dialog_submit" value="true" class="pn pnc"><strong>'+confirmtxt+'</strong></button>' : '');
		s += mode == 'confirm' ? '<button id="fwin_dialog_cancel" value="true" class="pn" onclick="hideMenu(\'' + menuid + '\', \'dialog\')"><strong>'+canceltxt+'</strong></button>' : '';
		s += '</p>';
	}
	s += '</td><td class="m_r"></td></tr><tr><td class="b_l"></td><td class="b_c"></td><td class="b_r"></td></tr></table>';
	menuObj.innerHTML = s;
	if($('fwin_dialog_submit')) $('fwin_dialog_submit').onclick = function() {
		if(typeof func == 'function') func();
		else eval(func);
		hideMenu(menuid, 'dialog');
	};
	if($('fwin_dialog_cancel')) {
		$('fwin_dialog_cancel').onclick = function() {
			if(typeof funccancel == 'function') funccancel();
			else eval(funccancel);
			hideMenu(menuid, 'dialog');
		};
		$('fwin_dialog_close').onclick = $('fwin_dialog_cancel').onclick;
	}
	showMenu({'mtype':'dialog','menuid':menuid,'duration':3,'pos':'00','zindex':JSMENU['zIndex']['dialog'],'cache':0,'cover':cover});
	try {
		if($('fwin_dialog_submit')) $('fwin_dialog_submit').focus();
	} catch(e) {}
}

function showWindow(k, url, mode, cache, menuv) {
	mode = isUndefined(mode) ? 'get' : mode;
	cache = isUndefined(cache) ? 1 : cache;
	var menuid = 'fwin_' + k;
	var menuObj = $(menuid);
	var drag = null;
	var loadingst = null;
	var hidedom = '';

	if(disallowfloat && disallowfloat.indexOf(k) != -1) {
		if(BROWSER.ie) url += (url.indexOf('?') != -1 ?  '&' : '?') + 'referer=' + escape(location.href);
		location.href = url;
		doane();
		return;
	}

	var fetchContent = function() {
		if(mode == 'get') {
			menuObj.url = url;
			url += (url.search(/\?/) > 0 ? '&' : '?') + 'infloat=yes&handlekey=' + k;
			url += cache == -1 ? '&t='+(+ new Date()) : '';
			if(BROWSER.ie &&  url.indexOf('referer=') < 0) {
				url = url + '&referer=' + encodeURIComponent(location);
			}
			ajaxget(url, 'fwin_content_' + k, null, '', '', function() {initMenu();show();});
		} else if(mode == 'post') {
			menuObj.act = $(url).action;
			ajaxpost(url, 'fwin_content_' + k, '', '', '', function() {initMenu();show();});
		}
		if(parseInt(BROWSER.ie) != 6) {
			loadingst = setTimeout(function() {showDialog('', 'info', '<img src="' + IMGDIR + '/loading.gif"> 请稍候...')}, 500);
		}
	};
	var initMenu = function() {
		clearTimeout(loadingst);
		var objs = menuObj.getElementsByTagName('*');
		var fctrlidinit = false;
		for(var i = 0; i < objs.length; i++) {
			if(objs[i].id) {
				objs[i].setAttribute('fwin', k);
			}
			if(objs[i].className == 'flb' && !fctrlidinit) {
				if(!objs[i].id) objs[i].id = 'fctrl_' + k;
				drag = objs[i].id;
				fctrlidinit = true;
			}
		}
	};
	var show = function() {
		hideMenu('fwin_dialog', 'dialog');
		v = {'mtype':'win','menuid':menuid,'duration':3,'pos':'00','zindex':JSMENU['zIndex']['win'],'drag':typeof drag == null ? '' : drag,'cache':cache};
		for(k in menuv) {
			v[k] = menuv[k];
		}
		showMenu(v);
	};

	if(!menuObj) {
		menuObj = document.createElement('div');
		menuObj.id = menuid;
		menuObj.className = 'fwinmask';
		menuObj.style.display = 'none';
		$('append_parent').appendChild(menuObj);
		evt = ' style="cursor:move" onmousedown="dragMenu($(\'' + menuid + '\'), event, 1)" ondblclick="hideWindow(\'' + k + '\')"';
		if(!BROWSER.ie) {
			hidedom = '<style type="text/css">object{visibility:hidden;}</style>';
		}
		menuObj.innerHTML = hidedom + '<table cellpadding="0" cellspacing="0" class="fwin"><tr><td class="t_l"></td><td class="t_c"' + evt + '></td><td class="t_r"></td></tr><tr><td class="m_l"' + evt + ')">&nbsp;&nbsp;</td><td class="m_c" id="fwin_content_' + k + '">'
			+ '</td><td class="m_r"' + evt + '"></td></tr><tr><td class="b_l"></td><td class="b_c"' + evt + '></td><td class="b_r"></td></tr></table>';
		if(mode == 'html') {
			$('fwin_content_' + k).innerHTML = url;
			initMenu();
			show();
		} else {
			fetchContent();
		}
	} else if((mode == 'get' && (url != menuObj.url || cache != 1)) || (mode == 'post' && $(url).action != menuObj.act)) {
		fetchContent();
	} else {
		show();
	}
	doane();
}

function showError(msg) {
	var p = /<script[^\>]*?>([^\x00]*?)<\/script>/ig;
	msg = msg.replace(p, '');
	if(msg !== '') {
		showDialog(msg, 'alert', '错误信息', null, true, null, '', '', '', 3);
	}
}

function hideWindow(k, all, clear) {
	all = isUndefined(all) ? 1 : all;
	clear = isUndefined(clear) ? 1 : clear;
	hideMenu('fwin_' + k, 'win');
	if(clear && $('fwin_' + k)) {
		$('append_parent').removeChild($('fwin_' + k));
	}
	if(all) {
		hideMenu();
	}
}

function AC_FL_RunContent() {
	var str = '';
	var ret = AC_GetArgs(arguments, "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000", "application/x-shockwave-flash");
	if(BROWSER.ie && !BROWSER.opera) {
		str += '<object ';
		for (var i in ret.objAttrs) {
			str += i + '="' + ret.objAttrs[i] + '" ';
		}
		str += '>';
		for (var i in ret.params) {
			str += '<param name="' + i + '" value="' + ret.params[i] + '" /> ';
		}
		str += '</object>';
	} else {
		str += '<embed ';
		for (var i in ret.embedAttrs) {
			str += i + '="' + ret.embedAttrs[i] + '" ';
		}
		str += '></embed>';
	}
	return str;
}

function AC_GetArgs(args, classid, mimeType) {
	var ret = new Object();
	ret.embedAttrs = new Object();
	ret.params = new Object();
	ret.objAttrs = new Object();
	for (var i = 0; i < args.length; i = i + 2){
		var currArg = args[i].toLowerCase();
		switch (currArg){
			case "classid":break;
			case "pluginspage":ret.embedAttrs[args[i]] = 'http://www.macromedia.com/go/getflashplayer';break;
			case "src":ret.embedAttrs[args[i]] = args[i+1];ret.params["movie"] = args[i+1];break;
			case "codebase":ret.objAttrs[args[i]] = 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0';break;
			case "onafterupdate":case "onbeforeupdate":case "onblur":case "oncellchange":case "onclick":case "ondblclick":case "ondrag":case "ondragend":
			case "ondragenter":case "ondragleave":case "ondragover":case "ondrop":case "onfinish":case "onfocus":case "onhelp":case "onmousedown":
			case "onmouseup":case "onmouseover":case "onmousemove":case "onmouseout":case "onkeypress":case "onkeydown":case "onkeyup":case "onload":
			case "onlosecapture":case "onpropertychange":case "onreadystatechange":case "onrowsdelete":case "onrowenter":case "onrowexit":case "onrowsinserted":case "onstart":
			case "onscroll":case "onbeforeeditfocus":case "onactivate":case "onbeforedeactivate":case "ondeactivate":case "type":
			case "id":ret.objAttrs[args[i]] = args[i+1];break;
			case "width":case "height":case "align":case "vspace": case "hspace":case "class":case "title":case "accesskey":case "name":
			case "tabindex":ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];break;
			default:ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
		}
	}
	ret.objAttrs["classid"] = classid;
	if(mimeType) {
		ret.embedAttrs["type"] = mimeType;
	}
	return ret;
}

function simulateSelect(selectId, widthvalue) {
	var selectObj = $(selectId);
	if(!selectObj) return;
	if(BROWSER.other) {
		if(selectObj.getAttribute('change')) {
			selectObj.onchange = function () {eval(selectObj.getAttribute('change'));}
		}
		return;
	}
	var widthvalue = widthvalue ? widthvalue : 70;
	var defaultopt = selectObj.options[0] ? selectObj.options[0].innerHTML : '';
	var defaultv = '';
	var menuObj = document.createElement('div');
	var ul = document.createElement('ul');
	var handleKeyDown = function(e) {
		e = BROWSER.ie ? event : e;
		if(e.keyCode == 40 || e.keyCode == 38) doane(e);
	};
	var selectwidth = (selectObj.getAttribute('width', i) ? selectObj.getAttribute('width', i) : widthvalue) + 'px';
	var tabindex = selectObj.getAttribute('tabindex', i) ? selectObj.getAttribute('tabindex', i) : 1;

	for(var i = 0; i < selectObj.options.length; i++) {
		var li = document.createElement('li');
		li.innerHTML = selectObj.options[i].innerHTML;
		li.k_id = i;
		li.k_value = selectObj.options[i].value;
		if(selectObj.options[i].selected) {
			defaultopt = selectObj.options[i].innerHTML;
			defaultv = selectObj.options[i].value;
			li.className = 'current';
			selectObj.setAttribute('selecti', i);
		}
		li.onclick = function() {
			if($(selectId + '_ctrl').innerHTML != this.innerHTML) {
				var lis = menuObj.getElementsByTagName('li');
				lis[$(selectId).getAttribute('selecti')].className = '';
				this.className = 'current';
				$(selectId + '_ctrl').innerHTML = this.innerHTML;
				$(selectId).setAttribute('selecti', this.k_id);
				$(selectId).options.length = 0;
				$(selectId).options[0] = new Option('', this.k_value);
				eval(selectObj.getAttribute('change'));
			}
			hideMenu(menuObj.id);
			return false;
		};
		ul.appendChild(li);
	}

	selectObj.options.length = 0;
	selectObj.options[0]= new Option('', defaultv);
	selectObj.style.display = 'none';
	selectObj.outerHTML += '<a href="javascript:;" id="' + selectId + '_ctrl" style="width:' + selectwidth + '" tabindex="' + tabindex + '">' + defaultopt + '</a>';

	menuObj.id = selectId + '_ctrl_menu';
	menuObj.className = 'sltm';
	menuObj.style.display = 'none';
	menuObj.style.width = selectwidth;
	menuObj.appendChild(ul);
	$('append_parent').appendChild(menuObj);

	$(selectId + '_ctrl').onclick = function(e) {
		$(selectId + '_ctrl_menu').style.width = selectwidth;
		showMenu({'ctrlid':(selectId == 'loginfield' ? 'account' : selectId + '_ctrl'),'menuid':selectId + '_ctrl_menu','evt':'click','pos':'43'});
		doane(e);
	};
	$(selectId + '_ctrl').onfocus = menuObj.onfocus = function() {
		_attachEvent(document.body, 'keydown', handleKeyDown);
	};
	$(selectId + '_ctrl').onblur = menuObj.onblur = function() {
		_detachEvent(document.body, 'keydown', handleKeyDown);
	};
	$(selectId + '_ctrl').onkeyup = function(e) {
		e = e ? e : window.event;
		value = e.keyCode;
		if(value == 40 || value == 38) {
			if(menuObj.style.display == 'none') {
				$(selectId + '_ctrl').onclick();
			} else {
				lis = menuObj.getElementsByTagName('li');
				selecti = selectObj.getAttribute('selecti');
				lis[selecti].className = '';
				if(value == 40) {
					selecti = parseInt(selecti) + 1;
				} else if(value == 38) {
					selecti = parseInt(selecti) - 1;
				}
				if(selecti < 0) {
					selecti = lis.length - 1
				} else if(selecti > lis.length - 1) {
					selecti = 0;
				}
				lis[selecti].className = 'current';
				selectObj.setAttribute('selecti', selecti);
				lis[selecti].parentNode.scrollTop = lis[selecti].offsetTop;
			}
		} else if(value == 13) {
			var lis = menuObj.getElementsByTagName('li');
			lis[selectObj.getAttribute('selecti')].onclick();
		} else if(value == 27) {
			hideMenu(menuObj.id);
		}
	};
}

function switchTab(prefix, current, total, activeclass) {
	$F('_switchTab', arguments);
}

function imageRotate(imgid, direct) {
	$F('_imageRotate', arguments);
}

function thumbImg(obj, method) {
	if(!obj) {
		return;
	}
	obj.onload = null;
	file = obj.src;
	zw = obj.offsetWidth;
	zh = obj.offsetHeight;
	if(zw < 2) {
		if(!obj.id) {
			obj.id = 'img_' + Math.random();
		}
		setTimeout("thumbImg($('" + obj.id + "'), " + method + ")", 100);
		return;
	}
	zr = zw / zh;
	method = !method ? 0 : 1;
	if(method) {
		fixw = obj.getAttribute('_width');
		fixh = obj.getAttribute('_height');
		if(zw > fixw) {
			zw = fixw;
			zh = zw / zr;
		}
		if(zh > fixh) {
			zh = fixh;
			zw = zh * zr;
		}
	} else {
		fixw = typeof imagemaxwidth == 'undefined' ? '600' : imagemaxwidth;
		if(zw > fixw) {
			zw = fixw;
			zh = zw / zr;
			obj.style.cursor = 'pointer';
			if(!obj.onclick) {
				obj.onclick = function() {
					zoom(obj, obj.src);
				};
			}
		}
	}
	obj.width = zw;
	obj.height = zh;
}

var zoomstatus = 1;
function zoom(obj, zimg, nocover, pn, showexif) {
	$F('_zoom', arguments);
}

function showselect(obj, inpid, t, rettype) {
	$F('_showselect', arguments);
}

function showColorBox(ctrlid, layer, k, bgcolor) {
	$F('_showColorBox', arguments);
}

function ctrlEnter(event, btnId, onlyEnter) {
	if(isUndefined(onlyEnter)) onlyEnter = 0;
	if((event.ctrlKey || onlyEnter) && event.keyCode == 13) {
		$(btnId).click();
		return false;
	}
	return true;
}

function parseurl(str, mode, parsecode) {
	if(isUndefined(parsecode)) parsecode = true;
	if(parsecode) str= str.replace(/\s*\[code\]([\s\S]+?)\[\/code\]\s*/ig, function($1, $2) {return codetag($2, -1);});
	str = str.replace(/([^>=\]"'\/]|^)((((https?|ftp):\/\/)|www\.)([\w\-]+\.)*[\w\-\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!]*)+\.(swf|flv))/ig, '$1[flash]$2[/flash]');
	str = str.replace(/([^>=\]"'\/]|^)((((https?|ftp):\/\/)|www\.)([\w\-]+\.)*[\w\-\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!]*)+\.(mp3|wma))/ig, '$1[audio]$2[/audio]');
	str = str.replace(/([^>=\]"'\/@]|^)((((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|ed2k|thunder|qqdl|synacast):\/\/))([\w\-]+\.)*[:\.@\-\w\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&;~`@':+!#]*)*)/ig, mode == 'html' ? '$1<a href="$2" target="_blank">$2</a>' : '$1[url]$2[/url]');
	str = str.replace(/([^\w>=\]"'\/@]|^)((www\.)([\w\-]+\.)*[:\.@\-\w\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&;~`@':+!#]*)*)/ig, mode == 'html' ? '$1<a href="$2" target="_blank">$2</a>' : '$1[url]$2[/url]');
	str = str.replace(/([^\w->=\]:"'\.\/]|^)(([\-\.\w]+@[\.\-\w]+(\.\w+)+))/ig, mode == 'html' ? '$1<a href="mailto:$2">$2</a>' : '$1[email]$2[/email]');
	if(parsecode) {
		for(var i = 0; i <= DISCUZCODE['num']; i++) {
			str = str.replace("[\tDISCUZ_CODE_" + i + "\t]", DISCUZCODE['html'][i]);
		}
	}
	return str;
}

function codetag(text, br) {
	var br = !br ? 1 : br;
	DISCUZCODE['num']++;
	if(br > 0 && typeof wysiwyg != 'undefined' && wysiwyg) text = text.replace(/<br[^\>]*>/ig, '\n');
	text = text.replace(/\$/ig, '$$');
	DISCUZCODE['html'][DISCUZCODE['num']] = '[code]' + text + '[/code]';
	return '[\tDISCUZ_CODE_' + DISCUZCODE['num'] + '\t]';
}

function saveUserdata(name, data) {
	try {
		if(window.localStorage){
			localStorage.setItem('Discuz_' + name, data);
		} else if(window.sessionStorage){
			sessionStorage.setItem('Discuz_' + name, data);
		}
	} catch(e) {
		if(BROWSER.ie){
			if(data.length < 54889) {
				with(document.documentElement) {
					setAttribute("value", data);
					save('Discuz_' + name);
				}
			}
		}
	}
	setcookie('clearUserdata', '', -1);
}

function loadUserdata(name) {
	if(window.localStorage){
		return localStorage.getItem('Discuz_' + name);
	} else if(window.sessionStorage){
		return sessionStorage.getItem('Discuz_' + name);
	} else if(BROWSER.ie){
		with(document.documentElement) {
			load('Discuz_' + name);
			return getAttribute("value");
		}
	}
}

function initTab(frameId, type) {
	$F('_initTab', arguments);
}

function openDiy(){
	if(DYNAMICURL) {
		window.location.href = SITEURL+DYNAMICURL + (DYNAMICURL.indexOf('?') < 0 ? '?' : '&') + ('diy=yes');
	} else {
		window.location.href = ((window.location.href + '').replace(/[\?\&]diy=yes/g, '').split('#')[0] + ( window.location.search && window.location.search.indexOf('?diy=yes') < 0 ? '&diy=yes' : '?diy=yes'));
	}
}

function hasClass(elem, className) {
	return elem.className && (" " + elem.className + " ").indexOf(" " + className + " ") != -1;
}

function runslideshow() {
	$F('_runslideshow', []);
}

function toggle_collapse(objname, noimg, complex, lang){
	var img, isCollapsed = false, obj = $(objname), img;
	if(obj){
		isCollapsed = obj.style.display === 'none';

		var collapsedStr = updatestring(getcookie('collapse'), objname, isCollapsed);
		setcookie('collapse', collapsedStr, (collapsedStr ? 2592000 : -2592000));
		
		obj.style.display = isCollapsed ? '' : 'none';
	}
	if(window.jQuery(objname + '_trigger')){
		jQuery('#' + objname + '_trigger')[isCollapsed ? 'removeClass' : 'addClass']('o_expand');
	}

	if(!noimg && (img = $(objname + '_img')) && img.tagName != 'IMG'){
		img.className = className.replace(isCollapsed ? '_no' : '_yes', isCollapsed ? '_yes' : '_no');
		if(lang){
			img.innerHTML = lang[isCollapsed ? 0 : 1];
		}
	}
	if(complex) {
		var objc = $(objname + '_c');
		if(objc) {
			objc.className = objc.className == 'umh' ? 'umh umn' : 'umh';
		}
	}
}

function updatestring(str1, str2, clear) {
	str2 = '_' + str2 + '_';
	return clear ? str1.replace(str2, '') : (str1.indexOf(str2) == -1 ? str1 + str2 : str1);
}

function getClipboardData() {
	window.document.clipboardswf.SetVariable('str', CLIPBOARDSWFDATA);
}

function setCopy(text, msg) {
	$F('_setCopy', arguments);
}

function copycode(obj) {
	$F('_copycode', arguments);
}

function showdistrict(container, elems, totallevel, changelevel, containertype) {
	$F('_showdistrict', arguments);
}

function setDoodle(fid, oid, url, tid, from) {
	$F('_setDoodle', arguments);
}


function extstyle(css) {
	$F('_extstyle', arguments);
}

var secST = new Array();
function updatesecqaa(idhash) {
	$F('_updatesecqaa', arguments);
}

function updateseccode(idhash, play) {
	$F('_updateseccode', arguments);
}

function checksec(type, idhash, showmsg, recall) {
	$F('_checksec', arguments);
}

function createPalette(colorid, id, func) {
	$F('_createPalette', arguments);
}

function showForummenu(fid) {
	$F('_showForummenu', arguments);
}

function showUserApp() {
	$F('_showUserApp', arguments);
}

function cardInit() {
	var cardShow = function (obj) {
		if(BROWSER.ie && BROWSER.ie < 7 && obj.href.indexOf('username') != -1) {
			return;
		}
		pos = obj.getAttribute('c') == '1' ? '43' : obj.getAttribute('c');
		USERCARDST = setTimeout(function() {ajaxmenu(obj, 500, 1, 2, pos, null, 'p_pop card');}, 250);
	};
	var cardids = {};
	var a = document.body.getElementsByTagName('a');
	for(var i = 0;i < a.length;i++){
		if(a[i].getAttribute('c')) {
			var href = a[i].getAttribute('href', 1);
			if(typeof cardids[href] == 'undefined') {
				cardids[href] = Math.round(Math.random()*10000);
			}
			a[i].setAttribute('mid', 'card_' + cardids[href]);
			a[i].onmouseover = function() {cardShow(this)};
			a[i].onmouseout = function() {clearTimeout(USERCARDST);};
		}
	}
}

function navShow(id) {
	var mnobj = $('snav_mn_' + id);
	if(!mnobj) {
		return;
	}
	var uls = $('mu').getElementsByTagName('ul');
	for(i = 0;i < uls.length;i++) {
		if(uls[i].className != 'cl current') {
			uls[i].style.display = 'none';
		}
	}
	if(mnobj.className != 'cl current') {
		showMenu({'ctrlid':'mn_' + id,'menuid':'snav_mn_' + id,'pos':'*'});
		mnobj.className = 'cl floatmu';
		mnobj.style.width = ($('nv').clientWidth) + 'px';
		mnobj.style.display = '';
	}
}

function strLenCalc(obj, checklen, maxlen) {
	var v = obj.value, charlen = 0, maxlen = !maxlen ? 200 : maxlen, curlen = maxlen, len = strlen(v);
	for(var i = 0; i < v.length; i++) {
		if(v.charCodeAt(i) < 0 || v.charCodeAt(i) > 255) {
			curlen -= charset == 'utf-8' ? 2 : 1;
		}
	}
	if(curlen >= len) {
		$(checklen).innerHTML = curlen - len;
	} else {
		obj.value = mb_cutstr(v, maxlen, 0);
	}
}

function patchNotice() {
	if($('patch_notice')) {
		ajaxget('misc.php?mod=patch&action=patchnotice', 'patch_notice', '');
	}
}

function pluginNotice() {
	var elem = $('plugin_notice');
	if(elem) {
		ajaxget('misc.php?mod=patch&action=pluginnotice', 'plugin_notice', '', null, null, function(){
			if(elem.innerHTML == ''){
				elem.style.display = 'none';
			}
		});
	}
}

function ipNotice() {
	var elem = $('ip_notice');
	if(elem){
		ajaxget('misc.php?mod=patch&action=ipnotice&_r='+Math.random(), 'ip_notice', '', null, null, function(){
			if(elem.innerHTML == ''){
				elem.style.display = 'none';
			}
		});
	}
}

function noticeTitle() {
	NOTICETITLE = {'State':0, 'oldTitle':NOTICECURTITLE, flashNumber:0, sleep:15};
	if(!getcookie('noticeTitle')) {
		window.setInterval('noticeTitleFlash();', 500);
	} else {
		window.setTimeout('noticeTitleFlash();', 500);
	}
	setcookie('noticeTitle', 1, 600);
}

function noticeTitleFlash() {
	if(NOTICETITLE.flashNumber < 5 || NOTICETITLE.flashNumber > 4 && !NOTICETITLE['State']) {
		document.title = (NOTICETITLE['State'] ? '【　　　】' : '【新提醒】') + NOTICETITLE['oldTitle'];
		NOTICETITLE['State'] = !NOTICETITLE['State'];
	}
	NOTICETITLE.flashNumber = NOTICETITLE.flashNumber < NOTICETITLE.sleep ? ++NOTICETITLE.flashNumber : 0;
}

function relatedlinks(rlinkmsgid) {
	$F('_relatedlinks', arguments);
}

function con_handle_response(response) {
	return response;
}

function showTopLink() {
	var ft = $('ft');
	if(ft){
		var scrolltop = $('scrolltop');
		var viewPortHeight = parseInt(document.documentElement.clientHeight);
		var scrollHeight = parseInt(document.body.getBoundingClientRect().top);
		var basew = parseInt(ft.clientWidth);
		var sw = scrolltop.clientWidth;
		if (basew < 1000) {
			var left = parseInt(fetchOffset(ft)['left']);
			left = left < sw ? left * 2 - sw : left;
			scrolltop.style.left = ( basew + left ) + 'px';
		} else {
			scrolltop.style.left = 'auto';
			scrolltop.style.right = 0;
		}

		if (BROWSER.ie && BROWSER.ie < 7) {
			scrolltop.style.top = viewPortHeight - scrollHeight - 150 + 'px';
		}
		if (scrollHeight < -100) {
			scrolltop.style.visibility = 'visible';
		} else {
			scrolltop.style.visibility = 'hidden';
		}
	}
}

function showCreditmenu() {
	$F('_showCreditmenu', []);
}

function showUpgradeinfo() {
	$F('_showUpgradeinfo', []);
}

function addFavorite(url, title) {
	try {
		window.external.addFavorite(url, title);
	} catch (e){
		try {
			window.sidebar.addPanel(title, url, '');
        	} catch (e) {
			showDialog("请按 Ctrl+D 键添加到收藏夹", 'notice');
		}
	}
}

function setHomepage(sURL) {
	if(BROWSER.ie){
		document.body.style.behavior = 'url(#default#homepage)';
		document.body.setHomePage(sURL);
	} else {
		showDialog("非 IE 浏览器请手动将本站设为首页", 'notice');
		doane();
	}
}

function setShortcut() {
	var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
	if(!loadUserdata('setshortcut') && !scrollTop) {
		$F('_setShortcut', []);
	}
}

function smilies_show(id, smcols, seditorkey) {
	$F('_smilies_show', arguments, 'smilies');
}

function showfocus(ftype, autoshow) {
	var id = parseInt($('focuscur').innerHTML);
	if(ftype == 'prev') {
		id = (id-1) < 1 ? focusnum : (id-1);
		if(!autoshow) {
			window.clearInterval(focusautoshow);
		}
	} else if(ftype == 'next') {
		id = (id+1) > focusnum ? 1 : (id+1);
		if(!autoshow) {
			window.clearInterval(focusautoshow);
		}
	}
	$('focuscur').innerHTML = id;
	$('focus_con').innerHTML = $('focus_'+(id-1)).innerHTML;
}

function rateStarHover(target,level) {
	if(level ==  0) {
		$(target).style.width = '';
	} else {
		$(target).style.width = level * 16 + 'px';
	}
}
function rateStarSet(target,level,input) {
	$(input).value = level;
	$(target).className = 'star star' + level;
}

function img_onmouseoverfunc(obj) {
	if(typeof showsetcover == 'function') {
		showsetcover(obj);
	}
	return;
}

function getElementOffset(element)
{
	var left = element.offsetLeft, top = element.offsetTop;
	while(element = element.offsetParent) {
		left += element.offsetLeft;
		top += element.offsetTop;
	}
	if($('nv').style.position == 'fixed') {
		top -= parseInt($('nv').style.height);
	}
	return {'left' : left, 'top' : top};
}

function mobileplayer()
{
	var platform = navigator.platform;
	var ua = navigator.userAgent;
	var ios = /iPhone|iPad|iPod/.test(platform) && ua.indexOf( "AppleWebKit" ) > -1;
	var andriod = ua.indexOf( "Android" ) > -1;
	if(ios || andriod) {
		return true;
	} else {
		return false;
	}
}

if(typeof IN_ADMINCP == 'undefined') {
	if(creditnotice != '' && getcookie('creditnotice')) {
		_attachEvent(window, 'load', showCreditPrompt, document);
	}
	if(typeof showusercard != 'undefined' && showusercard == 1) {
		_attachEvent(window, 'load', cardInit, document);
	}
}

/** end follow discuz common.js **/

/** follow discuz html5notification.js **/
function Html5notification() {
	var h5n = {};
	h5n.issupport = function() {
		var is = !!window.webkitNotifications;
		if(is) {
			if(window.webkitNotifications.checkPermission() > 0) {
				window.onclick = function() {
					window.webkitNotifications.requestPermission();
				}
			}
		}
		return is;
	};
	h5n.shownotification = function(replaceid, url, imgurl, subject, message) {
		if(!h5n.issupport()){ return; }

		if(window.webkitNotifications.checkPermission() > 0) {
			window.webkitNotifications.requestPermission();
		} else {
			var notify = window.webkitNotifications.createNotification(imgurl, subject, message);
			notify.replaceId = replaceid;
			notify.onclick = function() {
				window.focus();
				window.location.href = url;
				notify.cancel();
			};
			notify.show();
		}
	};
	return h5n;
}
/** end follow discuz html5notification.js **/


//Header Nav
jQuery(function($){
	var 
	timer,
	prevNav,
	prevIcon,
	prevLeft = 0,
	duration = 520,
	iconOffset = 20,
	shell = $('#navigator .nav'),
	currNav = shell.find('a.current')[0],
	focus = shell.find('.focus');
	if(!currNav){
		currNav = shell.find('a')[0];
	}
	
	function focusNav(link){
		//if(prevNav && prevNav === link){ return; }

		var 
		nav = $(link),
		left = nav.offset().left - shell.offset().left;

		if(left === prevLeft){ return; }
		
		var icon = nav.find('i')[0], width = nav.innerWidth();
		if(!ds.isIE6 && prevNav){
			$(prevNav).removeClass('hover');

			if(prevIcon && left > prevLeft && icon !== prevIcon){
				left -= iconOffset;
			}
		}

		if(!ds.isIE6 && icon){
			nav.addClass('hover');
			width += icon !== prevIcon ? iconOffset : 0;
		}

		ds.animate(focus[0], 'width', width, duration);
		focus.stop().addClass('wait')
		.animate({left:left}, duration, 'easeOutBack', function(){
			focus.removeClass('wait');
		});

		prevLeft = left;
		prevIcon = icon;
		prevNav = link;
	}
	
	shell.delegate('a', 'mouseenter', function(){
		focusNav(this);
	});
	shell.hover(function(){
		clearTimeout(timer);
	}, function(){
		clearTimeout(timer);
		timer = setTimeout(function(){
			focusNav(currNav);
		}, 360);
	});
	focusNav(currNav);
	
	ds.lazyResize(function(c){
		focusNav(currNav);
	});
});

//Auto Width
jQuery(function($){
	var view = $(window), docElem = $(document.documentElement);
	$('#switchwidth').bind('click', function(e){
		e.preventDefault();

		var isAuto = docElem.hasClass('widthauto');
		docElem[isAuto ? 'removeClass' : 'addClass']('widthauto');
		this.title = '切换到' + (isAuto ? '宽版' : '窄版');
		this.innerHTML = '<span>' + this.title + '</span>';

		setcookie('widthauto', isAuto ? -1 : 1, 86400 * 30);
		view.trigger('resize');
	});
});

//Return Top
jQuery(function($){
	var 
	timer,
	scrollIng = false,
	view = $(window),
	btn = $('#return_top'),
	checkScroll = function(){
		if(!scrollIng){
			var top = view.scrollTop();
			btn[top >= 100 ? 'show' : 'hide']();
		}
	},
	scrollHandler = function(){
		clearTimeout(timer);
		timer = setTimeout(checkScroll, 16);
	};
	view.bind('scroll', scrollHandler);
	scrollHandler();

	btn.bind('click', function(e){
		e.preventDefault();

		ds.scrollTo(0, function(){
			scrollIng = false;
		});
		scrollIng = true;
		btn.hide();
	});
});

//Top News
jQuery(function($){
	var shell = $('#bbs_top_news');
	if(!shell.length){ return; }

	function initFunc(){
		var 
		view = $(window),
		docElem = $(document.documentElement),
		delay = 640,
		minHeight = 58,
		maxHeight = 270,
		resizing = false,
		panel = shell.find('.section_panel'),
		orderPanel = shell.find('.order_panel'),
		isMini = shell.hasClass('top_news_mini');
		shell.delegate('a.switch', 'click', function(e){
			e.preventDefault();
			if(resizing){ return;}
			resizing = true;

			orderPanel.stop().animate({opacity:0}, delay);
			panel.stop().animate({opacity:0}, delay, function(){
				panel.animate({height:isMini ? minHeight : maxHeight}, delay, function(){
					shell[isMini ? 'addClass' : 'removeClass']('top_news_mini');
					orderPanel.animate({opacity:1}, delay);
					resizing = false;
				})
				.animate({opacity:1}, delay);
			});
			
			setcookie('topnews_mini', isMini ? 0 : 1, 86400 * 30);
			isMini = !isMini;
		});
		
		//order
		var 
		playTimer,
		playIndex = 0,
		playing = false,
		playDelay = 8000,//playDelay = 12000
		playDuration = 1520,
		playOffsetDelay = 200,
		playTriggers = shell.find('.order_panel a'),
		prevSection = panel.find('.section').eq(0),
		prevTrigger = playTriggers.eq(playIndex);
		shell.delegate('.order_panel a', 'click', function(e){
			e.preventDefault();
			
			if(playing || this.className.indexOf('current') > -1){ return;}
			clearTimeout(cdTimer); //stop cd autoplay
			playing = true;
			
			var 
			self = $(this),
			width = shell.width() + 100,
			section = $('#' + self.attr('href').slice(1));
			prevSection.stop().animate({left:-width}, playDuration, 'easeOutQuart');
			setTimeout(function(){
				prevTrigger.removeClass('current');
				self.addClass('current');
				section.stop().css('left', width).show().css('visibility', 'visible')
				.animate({left:0}, playDuration, 'easeOutQuart', function(){
					prevSection.css('visibility', 'hidden').css('left', 0);
					prevSection = section;
					prevTrigger = self;

					playIndex = playTriggers.index(self);
					panel.css('overflow', '');
					playing = false;
					
					autoPlay();
					
					//cd autoplay
					autoPlayCD();
				});
			}, playOffsetDelay);
			panel.css('overflow', 'hidden');
		});
		//auto play
		function autoPlay(){
			clearTimeout(playTimer);
			if(!shell.mouseEnter){
				playDelay = playIndex === 0 ? 8000 : 6000;//32000 : 12000;
				playTimer = setTimeout(function(){
					playTriggers.eq((playIndex + 1) % playTriggers.length).trigger('click');
				}, playDelay);
			}
		}
		shell.hover(function(){
			clearTimeout(playTimer);
			shell.mouseEnter = true;
		}, function(){
			shell.mouseEnter = false;
			autoPlay();
		});
		autoPlay();
		
		//cd player
		var 
		cdTimer,
		cdIndex = -1,
		cdPlaying = false,
		cdShell = shell.find('.wefiler_list'),
		cdTriggers = cdShell.find('.triggers a'),
		cdPics = cdShell.find('.inner a').fadeOut(400),
		cdMask = cdShell.find('a.cd_mask').attr('target', '_blank').html('<span>. . .</span>'),
		cdTitle = cdMask.find('span').eq(0),
		cdDisk = cdShell.find('i.cd'),
		userAgent = navigator.userAgent,
		oldDocOverflowX = docElem[0].style.overflowX,
		allowWiatDisk = ds.transitionSupport && !/mobile|ipad/i.test(userAgent) && (!/safari|firefox/i.test(userAgent) || BROWSER.chrome);
		function playCD(inx){
			inx = ~~inx % cdPics.length;
			if(!cdPlaying && inx !== cdIndex){
				cdPlaying = true;
				if(cdIndex >= 0){
					cdTriggers.eq(cdIndex).removeClass('current');
					cdPics.eq(cdIndex).stop().fadeOut(800);
				}
				
				var cd = cdPics.eq(inx).stop();
				cdMask.attr('href', cd.attr('href'));
				cdTitle.stop().fadeOut();
				if(allowWiatDisk){
					docElem[0].style.overflowX = 'hidden';
					cdDisk.addClass('wait');
				}
				setTimeout(function(){
					if(allowWiatDisk){
						cdTitle.stop().html(cd.attr('title')).fadeIn();
						cdDisk.removeClass('wait');
					}
					cdTriggers.eq(inx).addClass('current');
					cd.fadeIn(1200, function(){
						if(allowWiatDisk){
							docElem[0].style.overflowX = oldDocOverflowX;
						}
						else{
							cdTitle.stop().html(cd.attr('title')).fadeIn();
						}
						cdPlaying = false;
						cdIndex = inx;
						
						autoPlayCD();
					});
				}, allowWiatDisk ? 1600 : 0);
			}
		}
		function autoPlayCD(){
			clearTimeout(cdTimer);
			if(!isMini && prevSection.attr('id') === 'top_news_section'){
				cdTimer = setTimeout(function(){
					playCD(cdIndex + 1);
				}, 4800);
			}
		}
		cdShell.delegate('.triggers a', 'click', function(e){
			e.preventDefault();
			
			playCD(cdTriggers.index(this));
		});
		cdShell.hover(function(){
			clearTimeout(cdTimer);
		}, autoPlayCD);
		playCD(0);
		
		//Fix SectionWidth
		var 
		fixTimer,
		head = document.head || $('head')[0],
		style = document.createElement('style');
		style.type = 'text/css';
		head.insertBefore(style, head.firstChild);
		
		function resetSectionWidth(){
			if(docElem[0].className.indexOf('widthauto') < 0 || 
				shell[0].className.indexOf('top_news_mini') > -1)
			{
				return;
			}

			var 
			cssArr = [],
			width = shell.width(),
			panelWidth = width - 408,
			offset = 408 + 22 - 2 + (ds.isIE6 ? 4 : 0),
			tmpWidth = .5 * (width - offset);
			
			//normal li
			cssArr.push('.widthauto .top_news .section li{ width:');
			cssArr.push((tmpWidth/panelWidth*100).toFixed(4));
			cssArr.push('%}');
			
			//focus_sction li
			cssArr.push('.widthauto .top_news .focus_section li{ width:');
			if(width >= 1268){
				tmpWidth = .5 * (width - (408 + 25));
				cssArr.push((tmpWidth/panelWidth*100).toFixed(4));
			}
			else{
				cssArr.push(98);
			}
			cssArr.push('%}');

			//fitting_sction li
			offset -= 4;
			tmpWidth = .5 * (width - offset);
			cssArr.push('.widthauto .top_news .fitting_section li{ width:');
			cssArr.push((tmpWidth/panelWidth*100).toFixed(4));
			cssArr.push('%}');

			//set css
			if(style.styleSheet){
				style.styleSheet.cssText = cssArr.join('');
			}
			else{
				style.innerHTML = cssArr.join('');
			}
		}

		view.bind('resize.top_news', function(){
			clearTimeout(fixTimer);
			fixTimer = setTimeout(resetSectionWidth, 16);
		});
		resetSectionWidth();
	}
	
	var img = new Image();
	img.onload = initFunc;
	img.src = (window.STATIC_DIR || '') + 'images/cd_disk.png';
});

//bbs_notices
jQuery(function($){
	var shell = $('.bbs_notices ul').eq(0);
	if(shell.length){
		var 
		timer,
		inx = 0,
		unitSize = 28,
		delay = 16000,
		len = Math.ceil(shell.find('li').length / 2),
		fx = function(){
			inx = (inx+1) % len;
			shell.stop().animate({top:-inx*unitSize}, 200);

			timer = setTimeout(fx, delay);
		};
		if(len > 1){
			timer = setTimeout(fx, delay);
		}
	}
});

//nav weibo, weixin
jQuery(function($){
	var 
	follows = $('#weiphone_weibo, #weiphone_weixin'),
	initHandlers = {
		weibo: function(){
			var url = 'http://widget.weibo.com/relationship/bulkfollow.php?language=zh_cn&uids=1880927244,2839365622,2042941567,1972666515,3378938792,2533655895,2258131180,2876528520,2083731225&wide=1&color=FFF,FFF,0082CB,666666&showtitle=0&showinfo=1&sense=0&verified=1&count=10&refer=%27+%20encodeURIComponent(location.href)%20+%27&dpc=1';
			this.tips({
				autoDisplay: true,
				className: 'weibo_pop',
				offset: [0,0,0,200],
				content: '<div class="loading"></div><div class="weibo_pop_list" style="display:none"><iframe width="576" height="310" frameborder="0" scrolling="no" src="'+ url +'"></iframe></div>'
			});

			var tips = this.data('tips'), iframe = tips.shell.find('iframe');
			iframe.one('load', function(){
				tips.shell.find('.loading').remove();
				iframe.parent().show();
				iframe = null;
			});
			return tips;
		},
		weixin: function(){
			this.tips({
				autoDisplay: true,
				className: 'weibo_pop weixin_pop',
				offset: [0,0,0,44],
				content: '<div class="pop_inner"><img src="http://www.feng.com/images_v3/weixin_qr.png" height="140" width="140" alt="威锋网官方微信" /><em>扫一扫加威锋官方微信号</em><strong>微信号：weiphone_2007</strong></div>'
			});
		}
	};



	//var timer, follow = $('#weiphone_weibo, #weiphone_weixin');
	if($.Tips && follows.length){
		follows.each(function(){
			var timer, follow = $(this);
			follow.bind('mouseenter.init_tips', function(){
				clearTimeout(timer);
				timer = setTimeout(function(){
					follow.unbind('mouseenter.init_tips');

					var id = follow.attr('id').replace('weiphone_', '');
					initHandlers[id] && initHandlers[id].call(follow);

					var _show, tips = follow.data('tips');
					if(tips && (_show = tips.show)){
						tips.show = function(){
							if(this.shell.css('display') !== 'none'){
								return this;
							}
							return _show.apply(this, arguments);
						};
					}
				}, 360);

				follow.one('mouseleave', function(){
					clearTimeout(timer);
				});
			});
		});
	}
});

//page bigads
;(function($){
	var 
	shell, style,
	head = document.head || $('head')[0],
	_ops = {
		count: 0,
		active: false,
		startTime: '2013-10-10 0:0',
		endTime: '2199-12-12 0:0',
		isLightColor: false,
		customCSS: '',
		mLinkUrl: './',
		mImgUrl: 'about:blank',
		sLinkUrl: './',
		sImgUrl: 'about:blank'
	},
	linkTmpl = '<a href="{mLinkUrl}" class="link link_m" target="_blank"><img src="{mImgUrl}" /></a><a href="{sLinkUrl}" class="link link_s" target="_blank"><img src="{sImgUrl}" /></a>';
	function parseDate(dateStr){
		var date = new Date(0), rdate = /^(\d{4})\-(\d+)-(\d+)\s(\d+):(\d+)/;
		if(rdate.test(dateStr)){
			date.setYear(RegExp.$1);
			date.setMonth(RegExp.$2-1);
			date.setDate(RegExp.$3);
			date.setHours(RegExp.$4);
			date.setMinutes(RegExp.$5);
		}
		return date;
	}
	ds.mix({
		fillPageAd: function(ops){
			ops = ds.mix(ops || {}, _ops);

			var now = +new Date();
			if(!ops.active || now < +parseDate(ops.startTime) || now > +parseDate(ops.endTime)){ return; }

			//css
			if(!style){
				style = document.createElement('style');
				style.type = 'text/css';
				head.insertBefore(style, head.firstChild);
			}
			var cssArr = [];
			if(!ops.isLightColor){
				cssArr.push('.page_bigad .top_news .section li,.page_bigad .bbs_notices,.page_bigad .bbs_treasure li{box-shadow:none;}');
			}
			if(ops.customCSS){
				cssArr.push(ops.customCSS);
			}
			if(style.styleSheet){
				style.styleSheet.cssText = cssArr.join('');
			}
			else{
				style.innerHTML = cssArr.join('');
			}

			//html
			if(!shell){
				shell = document.createElement('div');
				shell.className = 'page_bigad_shell';
				document.body.insertBefore(shell, document.body.firstChild);
			}
			var html = linkTmpl.replace('{mLinkUrl}', ops.mLinkUrl).replace('{sLinkUrl}', ops.sLinkUrl)
					.replace('{mImgUrl}', ops.mImgUrl).replace('{sImgUrl}', ops.sImgUrl);
			shell.innerHTML = html;
			
			$(HTMLNODE).addClass('page_bigad');
		}
	});
})(jQuery);

//ads
jQuery(function($){
	$('.wea_d_panel_980').each(function(){
		if(this.innerHTML != ''){
			this.style.display = 'block';
		}
	});
});

/**
* jQuery.tips.js
* update: 2013.07.12
* admin@laoshu133.com
*/
;(function(global,$){var ds=global.ds||(global.ds={});var uuid=0,tipsTmpl='<div class="ds_tips_exts"><i class="ds_tips_arrow"><b></b></i></div><div class="ds_tips_content">{html}</div>',_ops={id:null,content:'',follow:null,width:'auto',height:'auto',className:'',animate:true,animateDuration:400,direction:'bottom',offset:[0,0,0,0],autoDisplay:true};ds.Tips=$.Tips=function(ops){this.init(ops||{});};ds.Tips.prototype={constructor:ds.Tips,init:function(ops){$.each(_ops,function(k,val){if(ops[k]===void 0){ops[k]=_ops[k]&&_ops[k].slice?_ops[k].slice(0):_ops[k];}});var elem=document.createElement('div');elem.id=ops.id?ops.id:'ds_tips_'+(++uuid);elem.style.cssText='display:none;position:absolute;opacity:0;filter:Alpha(opacity=0)';elem.className='ds_tips'+(ops.className?' '+ops.className:'');elem.innerHTML=tipsTmpl.replace('{html}',ops.content);this.ops=ops;this.follow=$(ops.follow);this.shell=$(elem).appendTo('body');this.arrow=this.shell.find('.ds_tips_arrow').eq(0);this.contentShell=this.shell.find('.ds_tips_content').eq(0);ops.autoDisplay&&this.show();},content:function(html){this.contentShell.html(html);return this;},show:function(direction,offset){var ops=this.ops,shell=this.shell;if(!offset||!offset.length){offset=ops.offset;}shell.stop().css('width',ops.width).css('height',ops.height).show();var arrow=this.arrow,follow=this.follow,followOffset=follow.offset(),shellWidth=shell.outerWidth(),topOffset=(parseFloat(offset[0])||0),leftOffset=(parseFloat(offset[3])||0),top=followOffset.top+follow.height()+arrow.outerHeight()+topOffset,left=followOffset.left+(follow.outerWidth()-shellWidth)/2+leftOffset;arrow.css('left',shellWidth/2-leftOffset);shell.css('left',left).css('top',top);if(ops.animate){shell.animate({opacity:1},ops.animateDuration);}return this;},hide:function(){var ops=this.ops,shell=this.shell;if(ops.animate){shell.stop().animate({opacity:0},ops.animateDuration,function(){shell.hide();});}else{shell.hide();}return this;},destroy:function(){this.shell.remove();this.shell=this.contentShell=this.follow=null;}};$.fn.tips=function(ops){var self=this,_ops={hoverTipsActiveShow:true,autoDisplay:false,follow:this,showDelay:240,hideDelay:360};if(typeof ops==='string'){_ops.content=ops;}else if(typeof ops==='object'){_ops=$.extend(true,_ops,ops);}if(!_ops.content){_ops.content=this.attr('data-tips')||'';}var timer,evtNameWhitIn='mouseenter.ds_tips',evtNameWhitOut='mouseleave.ds_tips',tips=new ds.Tips(_ops),showTips=function(){clearTimeout(timer);timer=setTimeout(function(){tips.show();},_ops.showDelay);},hideTips=function(){clearTimeout(timer);timer=setTimeout(function(){tips.hide();},_ops.hideDelay);};if(_ops.hoverTipsActiveShow){tips.shell.bind(evtNameWhitIn,showTips).bind(evtNameWhitOut,hideTips);}this.bind(evtNameWhitIn,showTips).bind(evtNameWhitOut,hideTips).data('tips',tips);var _destroy=tips.destroy;tips.destroy=function(){tips.shell.unbind(evtNameWhitIn,showTips).unbind(evtNameWhitOut,hideTips);self.unbind(evtNameWhitIn,showTips).unbind(evtNameWhitOut,hideTips).removeData('tips');_destroy.apply(this,arguments);};return this;};})(this,jQuery);
