//var url_domain = "http://www.yuelink.com/";
var url_domain = "http://localhost/";
var url_prefix = url_domain + "api/";
var songdata;
var songlinks = [];
var ids = [];
var songs;
var current = 2;

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
	id = ids[index];
	song = songs[index];
	var parent = $(".list")[current];
	parent.innerHTML += genExpandHtml(song);
	$(".item")[current].className = "item-expand";
}

function getData(data){
	songdata = data;
	$(".container")[0].innerHTML = genListsHtml(data);
	expand(current);
	soundManager.setup({
		// path to directory containing SM2 SWF
		url : 'swf/'
	});
//	alert(JSON.stringify(data));
}

function genListsHtml(data){
	var result = '<div style="width:100%;heigth:138px;"></div>';
	songs = data.related_songs;
	var name = data.name;
	$("#singer-title")[0].innerText = name;
	for (var i = 0; i < songs.length; i++){
		result += genListHtml(songs[i]);
		songlinks.push(songs[i].mp3_url);
		ids.push('ui-'+songs[i]._id);
	}
	return result;
}

function genListHtml(song){
	var singer = song.owner;
	var name = song.name;
	var mp3 = song.mp3_url;
	var result = '<div class="list"><div class="item"><div class="song-play"><div class="sample2"></div>'
		+ '<div id="ui-'+song._id+'" class="ui360"><a href="'+mp3+'"></a></div></div>'
		+ '<div class="songInfo"><span class="songtitle">'+name+'·'+singer+'</span> <br> <span class="comment">黄菊人首席混音师</span>'
			+ '</div></div></div>';
	
	return result;
}

function genExpandHtml(song){
	var result = '<div class="expand"><div class="good-button button"><div class="good"></div><div class="wrapper"></div>'
		+'赞 2,719</div><div class="play-button button sm2-360btn"><div class="pause"></div>'
		+'<div class="wrapper"></div><span class="sm2-timing">00:00</span> / <span class="sm2-time">00:00</span>'
		+'</div><div class="view-button button"><div class="view"></div><div class="wrapper"></div>浏览 24,953</div></div>';

	return result;
}