//var url_domain = "http://www.yuelink.com/";
var url_domain = "http://localhost/";
var url_prefix = url_domain + "api/";
var songdata;
var songlinks = [];
var songs;
var current = 0;

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

function expand(index){
	song = songs[index];
	var parent = $(".list")[index];
	parent.innerHTML += genExpandHtml(song);
	$("div.play-button").unbind();
	$("div.play-button").click(function(evt){
		$("div.item-expand span.sm2-360btn").click();
		if (soundManager){
			alert(soundManager.isPaused());
		}
	});
//	$(".item")[index].className = "item-expand";
}

function expandByIndex(index){
	$(".item-expand").attr("class", "item");
	$(".expand").hide();
	$(".expand").eq(index).show();
	$(".item")[index].className = "item-expand";
	$("div.item-expand span.sm2-360btn").click();
}


function getData(data){
//	alert(JSON.stringify(data));
	songdata = data;
	$(".container")[0].innerHTML = genListsHtml(data);
	for (var i = 0; i < data.related_songs.length; i++)
		expand(i);
	soundManager.setup({
		// path to directory containing SM2 SWF
		url : 'swf/'
	});
	expandByIndex(current);
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
	var result = '<div class="list" id="ui-'+index+'"><div class="item"><div class="song-play"><div class="avatar" style="background: url('+song.pic_normal_url+') 0px 0px no-repeat;"></div>'
		+ '<div class="ui360"><a href="'+mp3+'"></a></div></div>'
		+ '<div class="songInfo" onmousedown="expandByIndex('+index+')"><span class="songtitle">'+name+'·'+singer+'</span> <br> <span class="comment">黄菊人首席混音师</span>'
			+ '</div></div></div>';
	
	return result;
}

function genExpandHtml(song){
	var result = '<div class="expand"><div class="good-button button"><div class="good"></div><div class="wrapper"></div>'
		+'赞 2,719</div><div class="play-button button"><div class="pause"></div>'
		+'<div class="wrapper"></div><span class="sm2-timing">00:00</span> / <span class="sm2-time">00:00</span>'
		+'</div><div class="view-button button"><div class="view"></div><div class="wrapper"></div>浏览 24,953</div></div>';

	return result;
}