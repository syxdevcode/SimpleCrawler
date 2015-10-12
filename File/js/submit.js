;(function(window,document,undefined){
	submitObj = function (opt) {
		this.status = "Uninitialized";
		this.option = opt;
	};
	window.submitObj.prototype = {
		//参数合法性检测
		checkData:function(){
			for(var i in this.option){
				var tempProperty = this.option[i];
				if (tempProperty == undefined||tempProperty == null) {
					console.log("Configuration error.");
					return false;
				};
			}
		},
		//检查配置
		init:function (){
			var inputDataType = typeof this.option,
			_this = this;
			if (inputDataType !== 'object') {
				return false;
			};
			this.checkData();
			this.status = "Initialized";
			window.setTimeout(function(){
				_this.send();
			},0);
		},
		//创建表单
		createForm:function (){
			var _form;
			if(!_form){
				var shell = document.createElement('div');
				shell.style.cssText = 'display:none';
				shell.innerHTML = '<form action="about:blank" target="wep_notifyapp_ifa" method="post"></form><iframe src="javascript:;" id="wep_notifyapp_ifa" name="wep_notifyapp_ifa" frameborder="0"></iframe>';
				_form = shell.getElementsByTagName('form')[0];
				document.body.appendChild(shell);
			}
			return _form;
		},
		//发送数据
		send:function(){
			var 
			tmpArr = [],
			formHTML = "",
			form = this.createForm();
			for(var i in this.option){
				if (i === "postURL") {
					continue;
				};
				var val = this.option[i];
				tmpArr.push('input type="hidden" name="' + encodeURIComponent(i) + '" value="' + encodeURIComponent(val) + '" /');
			}
			formHTML = '<' + tmpArr.join('><') + '>';
			form.innerHTML = formHTML;
			form.action = this.option.postURL;
			form.submit();
		}
	};
})(window,document);
	//-------------for test-----------------
	//创建对象
/*
	var test = new submitObj({
		"postURL" : "http://www.baidu.com",//数据传送地址必填（postURL唯一且不可变）;下面的键值对可以随意定义
		"hahaha" : "test",
		"action_id" : "pengchuan",
		"user_id" : "pengchuan",
		"cookie_id" : "pengchuan",
		"ip_address" : "pengchuan",
		"tid" : "pengchuan",
		"fid" : "pengchuan",
		"theme_id" : "pengchuan",
		"browser_type" : "pengchuan",
		"system_type" : "pengchuan",
		"url" : "pengchuan",
		"vistor_date" : "pengchuan",
		"leave_dae" : "pengchuan",
		"create_date" : "pengchuan",
		"referrer" : "pengchuan"
	});
	//实例化对象并且发送数据
	test.init();
*/

