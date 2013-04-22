function getPar(par) {
	// 获取当前URL
	var local_url = document.location.href;
	// 获取要取得的get参数位置
	var get = local_url.indexOf(par + "=");
	if (get == -1) {
		return false;
	}
	// 截取字符串
	var get_par = local_url.slice(par.length + get + 1);
	// 判断截取后的字符串是否还有其他get参数
	var nextPar = get_par.indexOf("&");
	if (nextPar != -1) {
		get_par = get_par.slice(0, nextPar);
	}
	return get_par;
};

function getSharp() {
	// 获取当前URL
	var local_url = document.location.href;
	// 获取要取得的get参数位置
	var get = local_url.indexOf("#");
	if (get == -1) {
		return false;
	}
	// 截取字符串
	var get_par = local_url.slice(get + 1);

	return get_par;
};

String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
};

function hideblock(id, time) {
	$("#" + id).fadeOut(time);
}
function showblock(id, time) {
	$("#" + id).fadeIn(time);
}

function getIndexOfSongInNodes(songs, sid) {
	var index = 1;
	for ( var i = 0; i < songs.length; i++) {
		if (sid == songs[i]._id)
			return (i + 1);
	}
	return index;
}

function getWeiboShareApi(nid, sid, picurl, name, singer, songurl) {
	var url = "http://service.weibo.com/share/share.php?";
	url += "url="
			+ escape("http://www.yuelink.com/?node=" + nid + "&song=" + sid);
	url += "&title="
			+ encodeURIComponent("我在 #乐聆网# 发现了来自" + singer + "的《" + name
					+ "》，推荐给大家");
	url += "&pic=" + escape(picurl);
	url += "&ralateUid=2345174633";
	url += "&language=zh_cn";
	return url;
}

function isEmail(strEmail) {
	if (strEmail
			.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
		return true;
	else
		alert("非法邮箱地址");
}

function getTimeStr(seconds) {
	var result = '';
	var big = Math.floor(seconds / 60);
	if (big < 10)
		big = "0" + big;
	var small = seconds % 60;
	if (small < 10)
		small = "0" + small;
	result = big + ":" + small;
	return result;
}

function dump_obj(myObject) {
	var s = "";
	for ( var property in myObject) {
		s = s + "\n " + property + ": " + myObject[property];
	}
	alert(s);
}
