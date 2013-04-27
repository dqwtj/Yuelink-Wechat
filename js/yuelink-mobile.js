//var url_domain = "http://www.yuelink.com/";
var url_domain = "http://" + document.location.host + "/";
var url_prefix = url_domain + "api/";
var songdata;
var songlinks = [];
var songs;
var current = -1;
var soundManagerReady = false;
var quality_high = true;

//触发safari下点击事件的nb方法
function triggerClick(el) {
	var nodeName = el.nodeName, safari_chrome = /webkit/
			.test(navigator.userAgent.toLowerCase());
	if (!nodeName) return false;
	if (safari_chrome && (nodeName != 'INPUT' || nodeName != 'BUTTON')) {
		try {
			var evt = document.createEvent('Event');
			evt.initEvent('click', true, true);
			el.dispatchEvent(evt);
		} catch (e) {
			alert(e)
		}
		;
	} else {
		el.click();
	}
}

function loadsongs(nodeid){
	
	//var apiurl = 'http://www.yuelink.com/api/nodes/' + nodeid +'.json';
	var apiurl = url_prefix + 'nodes/' + nodeid +'.json';

	$.ajax({
		type: 'GET',
		url: apiurl,
		dataType: 'json',
		success:getData
		});
}

function expand(data){
	for (var i = 0; i < data.related_songs.length; i++){
		song = songs[i];
		var parent = $(".list")[i];
		parent.innerHTML += genExpandHtml(song, i);
	}
	$("div.play-button").unbind();
	$("div.play-button").click(function(evt){
		triggerClick($("div.item-expand span.sm2-360btn")[0]);
	});
}

function expandByIndex(index){
	if (current == index) return true;
	current = index;
	$(".item-expand").attr("class", "item");
	$(".expand").hide();
	if (index < 0) return;
	$(".expand").eq(index).show();
	$(".item")[index].className = "item-expand";
//	$("div.item-expand span.sm2-360btn").click();
//	threeSixtyPlayer.events.play();
	setTimeout(function(){	
		triggerClick($("div.item-expand span.sm2-360btn")[0]);
	},20);
//	$("div.play-button").click();
}


function getData(data){
//	alert(JSON.stringify(data));
	songdata = data;
	$(".container")[0].innerHTML = genListsHtml(data);
	expand(data);
	$(".expand").hide();
	soundManager.onready(function(){
//		alert("ready");
		soundManagerReady = true;
	});
	soundManager.setup({
		// path to directory containing SM2 SWF
		url : 'swf/'
	});
	if (data.related_songs.length > 0){
		var soundManagerReadyCheck = setInterval(function(){
			if (soundManagerReady) {
				clearInterval(soundManagerReadyCheck);
				threeSixtyPlayer.init();
//				expandByIndex(current);
			}
		}, 50);
	}
}

function genListsHtml(data){
	var result = '<div style="width:100%;heigth:138px;"></div>';
	songs = data.related_songs;
	var name = data.name;
	$("#singer-title")[0].innerText = name;
	for (var i = 0; i < songs.length; i++){
		result += genListHtml(songs[i], i);
		songlinks.push(songs[i].mp3_url);
	}
	return result;
}

function genListHtml(song, index){
	var singer = song.owner;
	var name = song.name;
	var mp3 = song.mp3_url;
	var result = '<div class="list" id="ui-'+index+'"><div class="item"><div class="song-play"><div class="avatar-cover"></div><div class="avatar" style="background: url('+song.pic_channel_url+') 0px 0px no-repeat;"></div>'
		+ '<div class="ui360"><a href="'+mp3+'"></a></div></div>'
		+ '<div class="songInfo" onclick="expandByIndex('+index+')"><span class="songtitle">'+name+'·'+singer+'</span> <br> <span class="comment">'+song.summary+'</span>'
			+ '</div></div></div>';
	
	return result;
}

function genExpandHtml(song, index){
	var result = '<div class="expand"><div class="good-button button" '
		+'onclick="clickToAddGood('+index+')"><div class="good"></div><div class="wrapper"></div>'
		+'赞 ' + song.wezan_count+'</div><div class="play-button button"><div class="pause"></div>'
		+'<div class="wrapper"></div><span class="sm2-timing">00:00</span> / <span class="sm2-time">00:00</span>'
		+'</div><div class="view-button button"><div class="view"></div><div class="wrapper"></div>浏览 '+song.play_count+'</div></div>';

	return result;
}

function clickMp3Quality(){
	if (quality_high){
		$("div.high-open").attr("class", "high-close");
//		$("div.ui360 a").eq(0).attr("href", "1.mp3");
		quality_high = false;
	} else {
		$("div.high-close").attr("class", "high-open");
		quality_high = true;
	}
}

function clickToAddGood(index){
	var cn = $("div.good-button").eq(index).attr("class");
	var p = cn.indexOf("pink");
	if (p >= 0){
		$("div.good-button").eq(index).attr("class", cn.substr(0, p-1));
	} else {
		$("div.good-button").eq(index).attr("class", cn + " pink");
	}
}