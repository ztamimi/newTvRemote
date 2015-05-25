// ui object
define(["modules/control", "jquery"], function(control, $) {
	var ui = {};
        
	ui.init = function() {
            console.log("ui.init");
            ui.volInput = $('#volume').val(50).slider();
            
            ui.speakerBtn = $('#speaker');
            ui.speakerImg = $('#speakerImg');
                        
            ui.playPauseBtn = $('#playPause');
            ui.playPauseImg = $('#playPauseImg');
                                    
            ui.carousel = $("#carousel");
            ui.list = $("#carousel ul");
            
            ui.registerEvents();
            
            ui.initCarousel();
            
            ui.enable(false);
	};
        
        ui.enable = function(value) {
            if (value) {
                ui.volInput.slider("enable");
                ui.playPauseBtn.on('click', ui.clickPlayPauseBtn);                
                ui.speakerBtn.on('click', ui.clickSpeakerBtn);
                ui.list.on('click', 'li a', ui.clickItem);
            }
            else {
                ui.volInput.slider("disable");
                ui.playPauseBtn.off('click', ui.clickPlayPauseBtn);                
                ui.speakerBtn.off('click', ui.clickSpeakerBtn);
                ui.list.off('click', 'li a', ui.clickItem);
            }
        };
        
	ui.registerEvents = function() {
                ui.playPauseBtn.on('click', ui.clickPlayPauseBtn);                
                ui.volInput.on('change', ui.changeVolumeSlider);
                ui.speakerBtn.on('click', ui.clickSpeakerBtn);
                
                //// carousel events ///////
                ui.carousel.on("swiperight", ui.clickBack);
                ui.carousel.on("swipeleft", ui.clickNext);
                ui.list.on('click', 'li a', ui.clickItem);
                
                // device orientation 
                $( window ).on( "orientationchange resize", function( event ) {
                    console.log("orientation change");
                    ui.initCarousel();
                });
                
                // slide
                $("#remotePage").on("swiperight", ui.goSearch);
                $("#remotePage").on("swipeleft", ui.goPlayList);
                
	};
        /////////// transitions /////////////
        ui.goSearch = function() {
            $.mobile.changePage("#searchPage", {transition: "slide", changeHash: false, reverse: "true"});
        };
        
        ui.goPlayList = function() {
            $.mobile.changePage("#playListPage", {transition: "slide", changeHash: false});
        };
        
        /////////// ui methods //////////////
        
        ui.initPlayPauseBtn = function() {
            ui.setPlayPause(false);
            control.updateByUi("play", false);
        };
        
        ui.initVolumeSlider = function() {
            ui.changeVolumeSlider();
        };
        
        ui.clickPlayPauseBtn = function() {
            if (ui.playPauseBtn.attr('data-play') === "play") {
                ui.setPlayPause(false);
                control.updateByUi("play", false);
            }
            else {
                ui.setPlayPause(true);
                control.updateByUi("play", true);
            }
        };
        
        ui.changeVolumeSlider = function() {
            var volume = parseInt(ui.volInput.val());
            
            ui.setSpeaker(volume);
           
            control.updateByUi("volume", volume);
        };
        
        ui.clickSpeakerBtn = function() {
            var newVolumeValue;
            if (ui.speakerBtn.attr('data-func') === 'speaker')
                newVolumeValue = 0;
            else
                newVolumeValue = 25;
            
            ui.setSpeaker(newVolumeValue);
            ui.setVolume(newVolumeValue);
            
            control.updateByUi("volume", newVolumeValue);
        };
        
        ui.updateValueByControl = function(key, value) {
            
            console.log("ui.updateValueByControl called " + key + ":" + value);
            
            switch(key) {
                case "connect":
                    ui.onConnect(value);
                    break;
                case "play":
                    ui.setPlayPause(value);
                    break;
                
                case "volume":
                    ui.setVolume(value);
                    ui.setSpeaker(value);
                    break;
                    
                case "index":
                    ui.highLightItem(value);
                    break;
                
                case "videoId":
                    var index = control.playList.indexOf(value);
                    ui.highLightItem(index);
                    break;
            };
        };
        
        ui.setPlayPause = function(value) {            
            if (value ) {
                ui.playPauseBtn.attr('data-play', "play");
                ui.playPauseImg.attr('src', 'css/pause.png');
            }
            else {
                ui.playPauseBtn.attr('data-play', "pause");
                ui.playPauseImg.attr('src', 'css/play.png');
            }
        };
        
        ui.setVolume = function(volume) {            
            ui.volInput.val(volume).slider('refresh');
        };
        
        ui.setSpeaker = function(volume) {
            if (volume > 0) {
                ui.speakerBtn.attr('data-func', 'speaker');
                ui.speakerImg.attr('src', 'css/speaker.png');
            }
            else {
               ui.speakerBtn.attr('data-func', 'mute');
               ui.speakerImg.attr('src', 'css/mute.png');
            }
        };
        
        //////////// carousel functions ////////////////////
            
        ui.initCarousel = function() {
            var w = window.innerWidth;
            
            ui.imageWidth = 120;
            ui.imageNum = parseInt(w/ui.imageWidth);
            if (ui.imageNum < 3) {
                ui.imageNum = 3;
                ui.imageWidth = parseInt(w/ui.imageNum);
            }
            var k = ui.imageWidth * ui.imageNum;
            $("#carousel").css({width: k});
            
            var images = ui.list.children(); //$("#carousel").find("img[class='slideImg']").
            
            images.css({width: ui.imageWidth});
            
            var imgNum = images.size();
            
            var totalWidth = ui.imageWidth * imgNum;
            ui.list.css({width: totalWidth});            
        };
            
        ui.addToCarousel = function(videoId) {
            var item = $("<li>", {'data-videoId': videoId});
            var link = $("<a>", {href: '#'/*, 'data-role': 'button'*/});
            var img = $("<img>", {class: "slideImg"});
            img.css({width: ui.imageWidth});
            link.append(img);
            item.append(link);
            item.appendTo(ui.list);
            var imgNum = ui.list.children().size();
            var totalWidth = imgNum * ui.imageWidth;
            ui.list.css({width: totalWidth});
            return (img);
        };
        
        ui.addSearchResult = function(videoId, titleText, imgUrl) {
            var item = $("<li>", {'data-videoId': videoId});
            var link = $("<a>", {href: '#'});
            var img = $("<img>", {src: imgUrl, class: "slideImg"});
            link.append(img);
            item.append(link);
            item.appendTo(ui.list);
            var imgNum = ui.list.children().size();
            var totalWidth = imgNum * ui.imageWidth;
            ui.list.css({width: totalWidth});
        };

        ui.removeCarouselItem = function(videoId) {
            var item = $("li[data-videoId*=" + videoId + "]")[0];
            item.remove();
        };
        
        ui.highLightItem = function(index) {
            
            ui.list.find("li").css("background", "none");

            var videoId = control.playList[index];
            var selector = "li[data-videoId=" + videoId + "]";
            var listItem = ui.list.find(selector);
            
            var loc = ui.list.find("li").index(listItem);
            var shift = loc - ui.imageNum + 1;
            for (i = 0; i < shift; i++) {
                ui.clickNext();
            }
            
            listItem.css("background", "#555");
        };
            
        ui.clickItem = function() {
            var listItem = $(this).parent("li");
            
            ui.list.find("li").css("background", "none");
            
            listItem.css("background", "#555");
            ui.setPlayPause(true);

            var videoId = listItem.attr("data-videoId");
            control.clickItem(videoId);
            
            ui.updateByUiCallback("videoId", videoId);
        };
        
        ui.setUpdateByUiCallback = function(callback) {
            ui.updateByUiCallback = callback;
        };
            
        ui.clickNext = function() {
            if (ui.imageNum >= control.playList.length)
                return;
            shift = '-' + ui.imageWidth;
            ui.list.animate({marginLeft: shift}, ui.nextCallback);
        };
            
        ui.clickBack = function() {
            if (ui.imageNum >= control.playList.length)
                return;
            ui.list.animate({marginLeft: ui.imageWidth}, ui.backCallback);
        };
            
        ui.nextCallback = function() {
            var lastItem = ui.list.find("li:last");
            var firstItem = ui.list.find("li:first");
            lastItem.after(firstItem);
            ui.list.css({marginLeft: 0});
        };
            
        ui.backCallback = function() {
            var lastItem = ui.list.find("li:last");
            var firstItem = ui.list.find("li:first");
            firstItem.before(lastItem);
            ui.list.css({marginLeft: 0});
        };
            
        ui.slide = function() {
            $.mobile.changePage("#remotePage", {transition: "slide", changeHash: false});
        };
        
    return ui;
});