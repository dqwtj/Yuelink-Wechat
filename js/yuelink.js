var _timeout = { adjustPosition : null };
/* ------- BASIC FUNCTIONS ------- */

/* ------- YUELINK OBJECTS ------- YUELINK OBJECTS ------- YUELINK OBJECTS ------- YUELINK OBJECTS ------- YUELINK OBJECTS ------- */
var $console, $player;
var $posters;
var $songInfo, $startMenu, $searchMenu, $fmMenu, $msgMenu, $userMenu;
var $wallWrapper, $nodeInfo;
var $sDetail, $review, $newSong, $activity, $userInfo;
var $register;
var url_domain = "http://" + document.location.host + "/";
//var url_domain = "http://www.yuelink.com/";
////var url_domain = "http://localhost:8080/";
var url_prefix = url_domain + "api/";

var settings = {};
var soundManagerReady = false;
var isOnPlay = false;

setTimeout(function(){initTimeout = true},2000);

var GC = {
	isSongDragging : false,
	isVolumeDragging : false,
	nid : 0,
	lastVolume : 100,
	isPopup : false,
	panelTimmer : 0,
	PANELTIMEOUT : 5000,
	
	showSummary : function(){
		var evt = document.createEvent("MouseEvents"); 
		evt.initEvent("click", false, false);// 或用initMouseEvent()，不过需要更多参数 
		$("#list").get(0).dispatchEvent(evt);
	},
	
	next : function(){
		if (player.log.upcoming.length>0 && !vars.in_animation && !isOnPlay){
			songInfo.toggleLyrics(false);
			GC.panelTimmer = GC.PANELTIMEOUT;
			player.next();
			api.nextSlide();
		}
	},
	
	prev : function(){
		if (player.log.history.length>0 && !vars.in_animation && !isOnPlay){
			songInfo.toggleLyrics(false);
			GC.panelTimmer = GC.PANELTIMEOUT;
			player.prev();
			api.prevSlide();
		}
	},
	
	togglePause : function(){
		player.togglePause();
	},

};

function yuelink_initialize () {
	// objects & variables
	$console = $('#console');
	$player = $('#player');
	
	$nodeInfo = $('#nodeInfo');
	
	soundManager.url = 'js/soundmanagerSWF/';
	soundManager.onready(function(){
		soundManagerReady = true;
	});
	
	$("#showcasemodal").click(function(){
		songInfo.hideLyrics();
	});
	
	$('#userBox, #playCtrl').click(function (event) {
		event.stopPropagation();
	});
	
	
	$('#playCtrl-button').click(function(){
		GC.togglePause();
	});
	$('#playCtrl-bar').click(function(event){
		var pos = (event.pageX - $(this).offset().left) / $(this).width();
		soundManager.setPosition(player.log.current, pos*player.durationEstimate);
	});
	$('#playCtrl-cycle').click(function(){
		player.toggleCycle();
	});
	$('#player #prev').click(function () {
		GC.prev();
	});
	$('#player #next').click(function () {
		GC.next();
	});
	$('#playCtrl-volume').click(function(event) {
		$( ".volume-cover" ).draggable("enable");
		player.changeVolume(event);
	});
	
	$('.speaker-white').click(player.toggleSilent);

	$('#list').click(function() {
		if (songInfo.isShow && player.isSummary){
			songInfo.toggleLyrics();
			$('div', '#list').attr('class', 'list-noactive');
		} else if (songInfo.isShow && !player.isSummary){
			$('div', '#list').attr('class', 'list-active');
			$('div', '#star').attr('class', 'star-noactive');
		} else if (!songInfo.isShow){
			songInfo.toggleLyrics();
			$('div', '#list').attr('class', 'list-active');
		}
		player.changeSumLyrPanel(true);
	});
	$('#star').click(function() {
		if (songInfo.isShow && !player.isSummary){
			songInfo.toggleLyrics();
			$('div', '#star').attr('class', 'star-noactive');
		} else if (songInfo.isShow && player.isSummary){
			$('div', '#list').attr('class', 'list-noactive');
			$('div', '#star').attr('class', 'star-active');
		} else if (!songInfo.isShow){
			songInfo.toggleLyrics();
			$('div', '#star').attr('class', 'star-active');
		}
		player.changeSumLyrPanel(false);
	});
	
	$( ".prog-cover" ).draggable({ axis: "x" }, 
			{ containment: "parent" }, 
			{ cursor: "pointer" },
			{ delay: 300 },
			{ distance: 10 },
			{drag: function( event, ui ) {
				GC.isSongDragging = true;
				var pos = parseInt($(".prog-cover").css("left")) / $("#playCtrl-bar").width();
				$('#playCtrl-time .position').text(player.getFormattedTime(pos*player.durationEstimate));
				$('.prog-white').css('width', $(".prog-cover").css("left"));
				soundManager.setPosition(player.log.current, pos*player.durationEstimate);
			}},
			{stop: function( event, ui ) {
				GC.isSongDragging = false;
			}}
			);
	$(".volume-cover").css("left" ,(player.volume / 100 * $('#playCtrl-volume').width() - 8) + "px");
	$( ".volume-cover" ).draggable({ axis: "x" }, 
			{ containment: "parent" }, 
			{ cursor: "pointer" },
			{ delay: 300 },
			{drag: function( event, ui ) {
				GC.isVolumeDragging = true;
				var pos = parseInt($(".volume-cover").css("left")) / $('#playCtrl-volume').width();
				if (pos > 0.5) pos = pos * 1.5;
				player.setVolume(pos * 100);
//				player.volume = pos;
//				$('.volumn-white').css("width", pos * $('#playCtrl-volume').width() + "px");
//				
//				soundManager.setVolume(player.log.current, pos * 100);
			}},
			{stop: function( event, ui ) {
				GC.isVolumeDragging = false;
			}}
			);
	GC.panelTimmer = GC.PANELTIMEOUT;
	setInterval(function(){
		if (GC.panelTimmer > 0){
			if (songInfo.isShow) GC.panelTimmer = -1;
			else GC.panelTimmer = GC.panelTimmer - 1000;
		} else if (GC.panelTimmer == 0){
			if (!songInfo.isShow && !GC.isPopup){
				GC.showSummary();
				GC.panelTimmer = GC.panelTimmer - 1000;
			} else {
				GC.panelTimmer = -1;
			}
		} else if (GC.panelTimmer == -2 * GC.PANELTIMEOUT){
			GC.panelTimmer = -1;
			songInfo.toggleLyrics(false);
		} else if (GC.panelTimmer != -1){
			GC.panelTimmer = GC.panelTimmer - 1000;
		}
	},1000);
}

function soundplayeReady(data, sid){;
	$(".channel-title").text(data.name);
	$("#channel-summary"). text((data.summary?"频道介绍: " + data.summary:"暂无介绍"));
	document.title = "乐聆网 - " + data.name;
	if (data.related_songs.length > 0){
		var soundManagerReadyCheck = setInterval(function(){
			if (soundManagerReady) {
				clearInterval(soundManagerReadyCheck);
				
				index = getIndexOfSongInNodes(data.related_songs, sid);
	
				player.append(data.related_songs, index);
				for (var i = 0; i < data.related_songs.length; i++){
					data.related_songs[i].image = data.related_songs[i].pic_bkg_url;
				}
				poster($, data.related_songs, index);
			}
		}, 50);
	} else {
		alert("No songs exist.");
	}
}
//load songs
function loadsongs(nodeid, index){
	GC.nid = nodeid;
	//var apiurl = 'http://www.yuelink.com/api/nodes/' + nodeid +'.json';
	var apiurl = url_prefix + 'nodes/' + nodeid +'.json';

	$.ajax({
		type: 'GET',
		url: apiurl,
		dataType: 'json',
		success:function(data){
			soundplayeReady(data, index);
		}
		});
}

function songInfoReady(song, obj){
	obj.info = song;
	songInfo.song = obj;
	var roleinfo = "";
	obj.author = "";
	for (var i = 0; i < song.user_roles.length; i++){
		if (song.user_roles[i].name == "演唱"){
			obj.author += song.user_roles[i].node_name + " ";
		}
		if (song.user_roles[i].name != ""){
			roleinfo += song.user_roles[i].name + " : " + song.user_roles[i].node_name + "<br>";
		}
	}
	if (obj.author == "") obj.author = "默认歌手";
	else obj.author = obj.author.substring(0, obj.author.length - 1);
	obj.info.roleinfo = roleinfo;
	if (obj.info.lyrics)
		obj.info.lyrics = obj.info.lyrics.replaceAll("\r\n", "<br>");
	else
		obj.info.lyrics = "暂无歌词";
	if (obj.info.summary)
		obj.info.summary = obj.info.summary.replaceAll("\r\n", "<br>");
	else
		obj.info.summary = "暂无介绍";
	
	setSongInfo(obj, GC.nid);

}

function setSongInfo(song, nid){
	$('#playCtrl h2').text(song.name + " - "+song.author);
	$('#playCtrl h2').attr("title", song.name + " - "+song.author);
	$('#playCtrl-button').css("background","url("+song.info.pic_button_url+") 4px 4px no-repeat");
	$('.song-title').text(song.info.name);
	$('#weibo').unbind();
	$('#weibo').click(function(){
		 window.open(getWeiboShareApi(nid, song.id, song.pic_bkg_url, song.info.name, song.author, song.url),  'newwindow',  "height=500, width=400");
	});
	player.setSummary(song.info);
}

function loadSongInfo(songid, songObj){
	var apiurl = url_prefix + 'songs/' + songid +'.json';

	$.ajax({
		type: 'GET',
		url: apiurl,
		dataType: 'json',
		success:function(data){
			songInfoReady(data, songObj);
		}
		});	
}

// isShow 是当前状态，userTrack 是用户手动操作。
var songInfo = {
	isShow: false,
	isManual: false,
	song : new Object(),
	showLyrics: function() {
		if(!this.isShow) {
			$('#showcase').animate({
				top: '+=210'
			},{
				duration: 500, 
				complete: function(){
					if (player.isSummary)
						$('div', "#list").attr('class', 'list-active');
					else
						$('div', "#star").attr('class', 'star-active');
				}
			});
			this.isShow = !this.isShow;
		}
	},
	hideLyrics: function() {
		if(this.isShow) {
			$('#showcase').animate({
				top: '-=210'
			},{
				duration: 500, 
				complete: function(){
					$('div', "#list").attr('class', 'list-noactive');
					$('div', "#star").attr('class', 'star-noactive');
				}
			});
			this.isShow = !this.isShow;
		}
	},
	toggleLyrics: function(show) {
		if (this.isShow == show) return;
		if (this.isShow) {
			this.hideLyrics();
		} else {
			this.showLyrics();
		}
	}
};

var player = {
/* PLAYER : controls playback */ 
		duration : false,
		durationEstimate : false,
		isPaused : true,
		isCycle : false,
		volume: 100,
		isSilent : false,
		isSummary: true,
		
		log : {
			history : new Array(),
			upcoming : new Array(),
			current: null
		},
		rawData : {},
		
		isLast : function(){
			return (player.log.upcoming.length == 0);
		},
		
		isFirst : function(){
			return (player.log.history.length == 0);
		},
		
		changeSumLyrPanel : function(isSummary){
			if (isSummary != null) player.isSummary = isSummary;
			if (player.isSummary){
				$('#lyrics').css("z-index", 8003);
				$('#summary').css("z-index", 8002);
				$('#lyrics').fadeOut();
				$('#summary').fadeIn();
			} else{
				$('#lyrics').css("z-index", 8002);
				$('#summary').css("z-index", 8003);
				$('#summary').fadeOut();
				$('#lyrics').fadeIn();	
			}
		},
		
		setSummary : function(songinfo){
			$('.lscroll').unbind();
			$('#summary').show();
			$('#lyrics').show();
			$('#sumText').css("text-align", "left");
			$('#sumText').css("width", "310px");
			$('#sumText').css("margin-left", "50px");
			$('#sumText').html("歌曲介绍:<br>" + songinfo.summary + "<br><br>" + songinfo.roleinfo + "<br>");

			$('#lyrText').css("text-align", "center");
			$('#lyrText').css("width", "360px");
			$('#lyrText').css("margin-left", "0px");
			$('#lyrText').html(songinfo.lyrics + "<br><br><br>");
			
			$('#sumText').attr('class', 'lscroll');
			$('#lyrText').attr('class', 'lscroll');
			$('.lscroll').scrollbars();	
		},
		
		play : function () {
			
			if (this.log.history.length == 1){
				$('#prev').hide();
			}
			if (this.log.upcoming.length == 0){
				$('#next').hide();
			}
			var avatar = this;
			
			soundManager.stopAll();
			this.duration = false;
			$('.play').attr('class', 'pause');
			id = this.log.current;
			$('#playCtrl h2').text(this.rawData[id].name);
			if (!this.rawData[id].info) {
				loadSongInfo(id, this.rawData[id]);
			} else {
				if (this.rawData[id]){
					songInfo.song = this.rawData[id];
					setSongInfo(this.rawData[id], GC.nid);
				}				
			}
			soundManager.play(this.log.current, {
				volume: this.volume,
				onplay : function(){
					isOnPlay = true;
					setTimeout(function(){isOnPlay = false},1000);
				},
				whileplaying : function(){
					if (!GC.isSongDragging){
						if (!avatar.durationEstimate) {
							$('#playCtrl-time .duration').text(player.getFormattedTime(this.durationEstimate));
							avatar.durationEstimate = this.durationEstimate;
						}
						if (!avatar.duration) {
							$('#playCtrl-time .duration').text(player.getFormattedTime(this.durationEstimate));
							avatar.duration = this.duration;
						}
						$('#playCtrl-time .position').text(player.getFormattedTime(this.position));
						$('.prog-cover').css('left', 100*this.position/this.durationEstimate + '%');
						$('.prog-white').css('width', 100*this.position/this.durationEstimate + '%');
					}
				},
				whileloading: function() {
					$('.prog-load').css('width', 100*this.bytesLoaded/this.bytesTotal + '%');
				},
				onfinish : function() {
					if (avatar.isCycle) {
						avatar.play();
					}
					else {
						if (!player.isLast()){
							GC.next();
						} else {
							player.play();
							player.pause();
						}
					}
				}
			});
			this.isPaused = false;
			$('.volumn-white').css('width', this.volume + '%');
			
			//暂时禁用自动弹出模块
//			if (songInfo.isManual) {
//				timeOfSInfoShow = setTimeout(function() {
//					songInfo.showLyrics();
//				}, 5000);
//				timeOfSInfoHide = setTimeout(function() {
//					songInfo.hideLyrics();
//				}, 12000);
//			}
			return this;
		},
		pause : function () {
			$('.pause').attr('class', 'play');
			soundManager.pause(this.log.current);
			this.isPaused = true;
			return this;
		},
		togglePause : function () {
			soundManager.togglePause(this.log.current);
			this.isPaused = !this.isPaused;
			$('div', '#playCtrl-button').toggleClass('play pause');
			return this.isPaused;
		},
		toggleCycle : function () {
			this.isCycle = !this.isCycle;
			$('div', '#playCtrl-cycle').toggleClass('uncycle cycle');
			return this.isCycle;
		},
		
		prev : function () {
			if (this.log.history.length>0) {
				$('#next').show();
				var id = this.log.history.pop();
				
				this.log.upcoming.splice(0,0, this.log.current);
				this.log.current = id;
				if ($('div', '#playCtrl-button').attr("class") === 'play') {
					$('div', '#playCtrl-button').attr('class', 'pause');
				};
				songInfo.hideLyrics();
				this.play();

				$('#playCtrl-thumb').attr('src', this.rawData[id].thumb);
			}
			return this;
		},
		next : function (para) {
			if (this.log.upcoming.length>0) {
				$('#prev').show();
				var id = this.log.upcoming.splice(0,1)[0];
				
				this.log.history.push(this.log.current);
				this.log.current = id;
				
				songInfo.hideLyrics();
				this.play();
				
				$('#playCtrl-thumb').attr('src', this.rawData[id].thumb);
			}
			return this;
		},
		
		append : function (options, index) {
			for (var i=0; i<options.length; i++) {
				//hotfix
				options[i].id = options[i]._id;
				options[i].url = options[i].mp3_url;
				options[i].title = options[i].name;
				options[i].author = 'Default Singer';
				//hotfix-end
				this.log.upcoming.push(options[i].id);
				soundManager.createSound({
					id : options[i].id,
					url : options[i].url
				});
				this.rawData[options[i].id] = options[i];
			}
			if (index > options.length) index = options.length - 1;
			if (index > 1){
				for (var i = 0; i < index; i++){
					var id = this.log.upcoming.splice(0,1)[0];
					
					this.log.history.push(this.log.current);
					this.log.current = id;	
				}
				this.play();
			}
			
			if (this.log.current == null) {
				this.next('null');
			}
			return this;
		},
		insert : function (options) {
			for (var i=options.length-1; i>=0; i--) {
				this.log.upcoming.splice(0, 0, options[i].id);
				soundManager.createSound({
					id : options[i].id,
					url : options[i].url
				});
				this.rawData[options[i].id] = options[i];
			}
			
			if (this.log.current == null) {
				this.next('null');
			}
			return this;
		},
		
		getFormattedTime : function (time) {
			var sec = parseInt(time/1000) % 60;
			var min = parseInt(time/60000);
			return min + ':' + ((sec<10) ? '0'+sec : sec);
		},
		
		changeVolume: function(event) {
			var pos = (event.pageX - $('#playCtrl-volume').offset().left) / $('#playCtrl-volume').width() * 100;
			if (pos > 0){
				player.setVolume(pos);
			}
//			this.volume = pos;
//			$(".volume-cover").css("left" ,(player.volume / 100 * $('#playCtrl-volume').width() - 8) + "px");
//			$('.volumn-white').css('width', pos + '%');
//			soundManager.setVolume(this.log.current, pos);
		},
		
		toggleSilent : function(){
			if (player.isSilent){
				player.isSilent = false;
				$(".volume-silent").hide();
				$( ".volume-cover" ).draggable("enable");
				player.setVolume(GC.lastVolume);
			} else {
				player.isSilent = true;
				$(".volume-silent").show();
				$( ".volume-cover" ).draggable("disable");
				tmp = player.volume;
				player.setVolume(0);
				GC.lastVolume = tmp;
			}
			
		},
		
		setVolume : function (pos){
			if (player.isSilent && pos != 0){
				$(".volume-silent").hide();
				player.isSilent = false;
			}
			player.volume = pos;
			GC.lastVolume = pos;
			$(".volume-cover").css("left" ,(player.volume / 100 * $('#playCtrl-volume').width() - 8) + "px");
			$('.volumn-white').css('width', pos + '%');
			soundManager.setVolume(this.log.current, pos);
		}
};

function poster($, songs, index){
	$.supersized({
	
		// Functionality
		slideshow               :   1,			// Slideshow on/off
		autoplay				:	0,			// Slideshow starts playing automatically
		start_slide             :   (index?index:1),			// Start slide (0 is random)
		random					: 	0,			// Randomize slide order (Ignores start slide)
		slide_interval          :   3000,		// Length between transitions
		transition              :   6, 			// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
		transition_speed		:	1000,		// Speed of transition
		new_window				:	1,			// Image links open in new window/tab
		pause_hover             :   0,			// Pause slideshow on hover
		keyboard_nav            :   0,			// Keyboard navigation on/off
		performance				:	1,			// 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
		image_protect			:	1,			// Disables image dragging and right click with Javascript
												   
		// Size & Position						   
		min_width		        :   0,			// Min width allowed (in pixels)
		min_height		        :   0,			// Min height allowed (in pixels)
		vertical_center         :   1,			// Vertically center background
		horizontal_center       :   1,			// Horizontally center background
		fit_always				:	0,			// Image will never exceed browser width or height (Ignores min. dimensions)
		fit_portrait         	:   1,			// Portrait images will not exceed browser height
		fit_landscape			:   0,			// Landscape images will not exceed browser width
												   
		// Components							
		slide_links				:	'blank',	// Individual links for each slide (Options: false, 'num', 'name', 'blank')
		thumb_links				:	1,			// Individual thumb links for each slide
		thumbnail_navigation    :   0,			// Thumbnail navigation
		slides 					:  	songs,
		mouse_scrub				:	0
		
	});
};

//keyboard-nav
$(document).keyup(function (event) {
	if (!GC.isPopup){
		if (event.keyCode == 32){
			GC.togglePause();
		} else if (event.keyCode == 39){
			GC.next();
		} else if (event.keyCode == 37){
			GC.prev();
		}
	}
});

var WidgtWizzard = {
		popupHtml : function($){
			var html = '';
			return html;
		}
};