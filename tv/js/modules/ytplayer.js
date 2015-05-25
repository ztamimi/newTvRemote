define(['jquery', 'modules/tv'], function($, tv) {
    
    var ytplayer = {};
    
    ytplayer.init = function() {
        ytplayer.width = window.innerWidth;
        ytplayer.height = window.innerHeight;
        ytplayer.initPlayer("player", "");
        $(window).on( "resize orientationchange", function(event) {
                console.log("resize");
                var width = window.innerWidth;
                var height = window.innerHeight;
                if (ytplayer.player)
                    ytplayer.player.setSize(width, height);
            });
    };
        
    ytplayer.initPlayer = function(container, videoId) {
        if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
            window.onYouTubeIframeAPIReady = function() {
                if ($("#player"))
                    ytplayer.loadPlayer(container, videoId);
            };
            $.getScript('http://www.youtube.com/iframe_api');
        } 
        else {
            ytplayer.loadPlayer(container, videoId);
        }
    };
    
    ytplayer.cleanup = function() {
        ytplayer.player.destroy();
    };
    
    ytplayer.loadPlayer = function(container, videoId) {
        console.log("************** player loaded *******************");
        ytplayer.player = new YT.Player(container, {
            videoId: videoId,
            width: ytplayer.width,
            height: ytplayer.height,
            events: {
                'onReady': ytplayer.onPlayerReady,
		'onStateChange': ytplayer.onStateChange
            }
        // For a list of all parameters, see:
        // https://developers.google.com/youtube/player_parameters
        });
        ytplayer.playerLoadedCallback();
    };
    
    ytplayer.onStateChange = function() {
        console.log("ytplayer.onStateChange called");
        
        console.log(ytplayer.player.getPlayerState());
        
        var status = ytplayer.player.getPlayerState();
        if (status === 1)       // playing
            tv.updateByUi("play", true);
        else 
            if (status === 2)       // paused
                tv.updateByUi("play", false);
              
        var volume = parseInt(ytplayer.player.getVolume());        
        tv.updateByUi("volume", volume);
        
        if (status === 3) {     // buffering
            var index = ytplayer.player.getPlaylistIndex();
            if (index < 0)
                return;
            var videoId = tv.playList[index];
            tv.updateByUi("videoId", videoId);
        }
    };
    
    ytplayer.onPlayerReady = function() {
        ytplayer.loadPlayList();
    };
    
    ytplayer.loadPlayList = function() {
        if (! ytplayer.player)
            return;
        
        if (!tv.playList.length)
            return;
        
        var index = tv.playList.indexOf(tv.videoId);
        if (index < 0) {
            index = 0;
            tv.updateByUi("videoId", tv.playList[index]);
        }
            
        ytplayer.player.cuePlaylist(tv.playList, index);
    };  

    ytplayer.playVideo = function() {
        if (!tv.playList.length)
            return;
        if (tv.playList.indexOf(tv.videoId) < 0) {
            tv.videoId = tv.playList[0];
            tv.updateByUi("videoId", tv.playList[0]);
        }
        ytplayer.player.playVideo();
    };

    ytplayer.updateValueByTv = function(key, value) {
        if (!ytplayer.player)
            return;
        
        switch(key) {
            case "play":
                if (value)
                    ytplayer.playVideo();
//
                    //ytplayer.player.playVideo();
		else
                    ytplayer.player.pauseVideo();
                break;
                
            case "volume":
                ytplayer.player.setVolume(value);
                break;
            
            case "videoId":
                var index = tv.playList.indexOf(value);
                if (index < 0)
                    return;
                //var status = ytplayer.player.getPlayerState();
                //if (status === 1 || status === 2) 
                //    ytplayer.player.stopVideo();
                
                ytplayer.player.playVideoAt(index);
	};
    };
    
    ytplayer.updateListByTv = function(key, value) {
        if (!ytplayer.player)
            return;
        
        var status = ytplayer.player.getPlayerState();
        if (status === 1 || status === 2) {
            var i = ytplayer.player.getPlaylistIndex();
            ytplayer.player.pauseVideo();
            var t = ytplayer.player.getCurrentTime();
            
            ytplayer.player.loadPlaylist(tv.playList, i, t);
            if (status === 2)
                ytplayer.player.pauseVideo();
        }
        else
            ytplayer.loadPlayList();
    };
    
    ytplayer.setPlayerLoadedCallback = function(callback) {
        ytplayer.playerLoadedCallback = callback;
    };
    
    return ytplayer;
});

