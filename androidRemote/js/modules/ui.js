// ui object
define(["modules/control", "jquery", "jqueryMobile"], function(control) {
	var ui = {};
        
        ui.render = function() {
            var pageItem = $("<div>", {'data-role': "page", id: "remotePage", 'data-theme': 'b'});
            var headerItem = $("<div>", {'data-role': "header", 'data-position': "fixed"});
            var setItem = $("<fieldset>", {id: "connectForm", 'data-role': "collapsible", 'data-mini': "true", 'data-iconpos': "right", 'data-collapsed-icon': "carat-d", 'data-expanded-icon': "carat-u"});
            setItem.append($("<legend>").text("Connect to monitor"));
            var tableItem = $("<table>");
            
            var tdItem1 = $("<td>");
            var inputItem1 = $("<input>", {type: "text", id: "monitorId", value: "", placeholder: "Monitor ID...", 'data-mini': "true", 'data-inline': "true"});
            tdItem1.append(inputItem1);
            
            var tdItem2 = $("<td>");
            var inputItem2 = $("<input>", {type: "button", id: "connect", 'data-icon': "check", 'data-iconpos': "notext", 'data-mini': "true", 'data-inline': "true"});
            tdItem2.append(inputItem2);
            
            tableItem.append(tdItem1);
            tableItem.append(tdItem2);
            
            setItem.append(tableItem);
            headerItem.append(setItem);
            pageItem.append(headerItem);
            
            var divItem = $("<div>", {id: "connectStatus", 'data-role': "popup", 'data-theme': "none", 'data-overlay-theme': "b", 'data-transition': "fade", class: "ui-content"});
            divItem.text("connecting...");
            pageItem.append(divItem);
            
            var contentItem = $("<div>", {'data-role': "content", class: "noMargins"});
            var formItem = $("<form>");
            var formItem1 = $("<div>", {class: "align-right", style: "padding-right: 5px"});
            var aItem1 = $("<a>", {href: '', id: 'speaker', 'data-func': 'speaker'});
            var imgItem1 = $("<img>", {id: 'speakerImg', src: 'css/speaker.png', class: 'imgIcon'});
            aItem1.append(imgItem1);
            formItem1.append(aItem1);
            //<div class="align-right" style="padding-right: 5px"><a href="" id="speaker" data-func="speaker"><img id="speakerImg" src="css/speaker.png" class="imgIcon"></a></div>
            formItem.append(formItem1);
            
            //<div class="ui-grid-solo">
            //  <div class="ui-block-a align-center"><a href="" data-play="pause" id="playPause"><img id="playPauseImg" src="css/play.png" class="imgbtnL1"></a></div>
            //</div>
            
            formItem2 = $("<div>", {class: "ui-grid-solo"});
            subdiv = $("<div>", {class: "ui-block-a align-center"});
            aItem2 = $("<a>", {href: "", 'data-play': "pause", id: "playPause"});
            imgItem2 = $("<img>", {id: "playPauseImg", src: "css/play.png", class: "imgbtnL1"});
            aItem2.append(imgItem2);
            subdiv.append(aItem2);
            formItem2.append(subdiv);
            formItem.append(formItem2);
            
            //<input id="volume" min="0" max="100" value="50" type="range" data-role="none" data-mini="true" data-theme="a" data-track-theme="b" data-highlight="true" style="display: none !important" />
            //formItem3 = //$("<div>");
            formItem3 = $("<input>", {id: "volume", min: "0", max: "100", value: "50", type: "range", 'data-role': "none", 'data-mini': "true", 'data-theme': "a", 'data-track-theme': "b", 'data-highlight': "true", style:"display: none !important"});
            //formItem3.append(inputItem3);
            formItem.append(formItem3);
            
            //<div id="carousel"><ul></ul></div>
            
            formItem4 = $("<div>", {id: "carousel"});
            formItem4.append($("<ul>"));
            formItem.append(formItem4);
            
            contentItem.append(formItem);
            
            pageItem.append(contentItem);
            
            var footerItem = ui.renderFooter();
            pageItem.append(footerItem);
            
            $("body").append(pageItem);
        };
        
        ui.renderFooter = function() {
            var divItem = $("<div>", {'data-role': 'footer', 'data-position': 'fixed'});
            var navItem = $("<nav>", {'data-role': 'navbar'});
            var ulItem = $("<ul>");
            var liItem1 = $("<li>");
            var aItem1 = $("<a>", {'data-icon': 'search', href: '#searchPage'});
            liItem1.append(aItem1);
                
            var liItem2 = $("<li>");
            var aItem2 = $("<a>", {'data-icon': 'grid', href: '#remotePage'});
            liItem2.append(aItem2);
                
            var liItem3 = $("<li>");
            var aItem3 = $("<a>", {'data-icon': 'plus', href: '#playListPage'});
            liItem3.append(aItem3);
                
            ulItem.append(liItem1);
            ulItem.append(liItem2);
            ulItem.append(liItem3);
                
            navItem.append(ulItem);
            divItem.append(navItem);
            return divItem;
        };
        /*
        ui.renderSplash = function() {
            var pageItem = $("<div>", {'data-role': 'page', id: 'splashPage', 'data-theme': 'b'});
            var item = $("<div>", {'data-role': 'content', 'data-theme': 'b'});
            item.text("Loading...");
            pageItem.append(item);
            $('body').append(pageItem);
        };
        */
	ui.init = function() {
            
            ui.render();
            
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
                if (ui.playPauseBtn.attr('data-play') === 'pause')
                    ui.playPauseImg.attr('src', 'css/play.png');
                else
                    ui.playPauseImg.attr('src', 'css/pause.png');

            }
            else {
                ui.volInput.slider("disable");
                ui.playPauseBtn.off('click', ui.clickPlayPauseBtn);                
                ui.speakerBtn.off('click', ui.clickSpeakerBtn);
                ui.list.off('click', 'li a', ui.clickItem);
                if (ui.playPauseBtn.attr('data-play') === 'pause')
                    ui.playPauseImg.attr('src', 'css/gray_play.png');
                else
                    ui.playPauseImg.attr('src', 'css/gray_pause.png');
            }
        };
        
	ui.registerEvents = function() {
                //ui.playPauseBtn.on('click', ui.clickPlayPauseBtn);                
                ui.volInput.on('change', ui.changeVolumeSlider);
                //ui.speakerBtn.on('click', ui.clickSpeakerBtn);
                
                //// carousel events /////// 
                ui.carousel.on("swiperight", ui.clickBack);
                ui.carousel.on("swipeleft", ui.clickNext);
                //ui.list.on('click', 'li a', ui.clickItem);
                
                // device orientation 
                $( window ).on( "orientationchange resize", function(event) {
                    console.log("orientation change");
                    ui.initCarousel();
                });
                
                // slide
                $("#remotePage").on("swiperight", ui.goSearch);
                $("#remotePage").on("swipeleft", ui.goPlayList);
                
	};
        /////////// transitions /////////////
        ui.goSearch = function(event) {
            if (event.target.className === "slideImg")
                return;
            $.mobile.changePage("#searchPage", {transition: "slide", changeHash: false, reverse: "true"});
        };
        
        ui.goPlayList = function(event) {
            if (event.target.className === "slideImg")
                return;
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
            var item = $("li[data-videoId=" + videoId + "]");
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