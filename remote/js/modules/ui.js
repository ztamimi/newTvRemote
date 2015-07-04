// ui object
define(["modules/control", "jquery", "jquerymobile"], function(control) {
	var ui = {};
        
        ui.render = function() {
            var pageItem = $("<div>", {'data-role': "page", id: "remotePage", 'data-theme': 'b'});
            
            var header = ui.renderHeader();
            pageItem.append(header);
            
            var connectDiv = $("<div>");
            var connectForm = $("<fieldset>", {id: "connectForm", 'data-role': "collapsible", 'data-mini': "true", 'data-iconpos': "right", 'data-collapsed-icon': "carat-d", 'data-expanded-icon': "carat-u"});
            connectForm.append($("<legend>").text("Connect to monitor"));
            
            var table = $("<table>", {width: '100%'});
            var monitorInput = $("<td>").append($("<input>", {type: "text", id: "monitorId", value: "", placeholder: "Monitor ID...", 'data-inline': "true", 'data-theme': 'a'}));
            var connectBtn = $("<td>").append($("<input>", {type: "button", id: "connect", 'data-icon': "check", 'data-iconpos': "notext", 'data-mini': "true", 'data-inline': "true"}));
            table.append(monitorInput);            
            table.append(connectBtn);
            
            var title = $("<p>", {class: 'info_title'}).text("How to connect to monitor");
            var connectInfo = $("<p>", {class: 'info_desc'}).text("On the desired machine (laptop, smart tv, playstation, etc). Launch the web browser and go to http://moboremote.com. Type the monitor ID in the field and hit the button.");
            connectForm.append(title);
            
            connectForm.append(table);

            connectForm.append(connectInfo);
            
            var disconnectInfo  = $("<p>", {class: 'info_desc'}).text('To disconnect, return to this dialog (click on "connect to monitor") and click on the button next to the monitor ID.');
            connectForm.append(disconnectInfo);
            
            connectDiv.append(connectForm);
            
            pageItem.append(connectDiv);
            
            var connectStatusDiv = $("<div>", {id: "connectStatus", 'data-role': "popup", 'data-history': false, 'data-theme': "none", 'data-overlay-theme': "b", 'data-transition': "fade", class: "ui-content popup_message"});
            connectStatusDiv.text("connecting...");
            pageItem.append(connectStatusDiv);
            
            var contentItem = $("<div>", {'data-role': "content", class: "noMargins"});
            var remoteDiv = $("<div>", {id: "remoteDiv"});
            var formItem = $("<form>");
            
            playForm = $("<div>", {class: "ui-grid-solo", style: 'padding-top: 15px'});
            
            playDiv = $("<div>", {class: "ui-block-a align-center"});
            playLink = $("<a>", {href: "", 'data-play': "pause", id: "playPause"});
            //var imgSrc = $("#playUri").attr('src');
            playImg = $("<img>", {id: "playPauseImg", class: "imgbtnL1", src: "css/images/play.png"});//.attr('src', imgSrc);
            playLink.append(playImg);
            playDiv.append(playLink);
            
            playForm.append(playDiv);
            formItem.append(playForm);
            
            volumeInput = $("<input>", {id: "volume", min: "0", max: "100", value: "50", type: "range", 'data-role': "none", 'data-mini': "true", 'data-theme': "a", 'data-track-theme': "b", 'data-highlight': "true", style:"display: none !important"});
            volumeDiv = $("<div>", {class: 'ui-block-a', style: 'padding: 5px 15px'});
            volumeDiv.append(volumeInput);
            volumeForm = $("<div>", {class: 'ui-grid-solo'});
            volumeForm.append(volumeDiv);
            formItem.append(volumeForm);
            
            carouselDiv = $("<div>", {id: "carousel"});
            carouselDiv.append($("<ul>"));
            formItem.append(carouselDiv);
            
            controlForm = $("<div>", {class: 'ui-grid-d align-center'});
            backDiv = $("<div>", {class: 'ui-block-a'});
            backBtn = $("<input>", {type: "button", id: "backBtn", 'data-icon': "carat-l", 'data-iconpos': "notext", 'data-mini': "true", 'data-inline': "true"});
            backDiv.append(backBtn);
            
            playListDiv = $("<div>", {class: 'ui-block-b', style: 'margin-top: 25px'});
            playListBtn = $("<input>", {type: "button", id: "playListBtn", 'data-icon': "plus", 'data-iconpos': "notext", 'data-mini': "true", 'data-inline': "true"});
            playListDiv.append(playListBtn);
            
            audioDiv = $("<div>", {class: 'ui-block-c', style: 'margin-top: 15px'});
            audioBtn = $("<input>", {type: "button", id: "audioBtn", 'data-icon': "audio", 'data-iconpos': "notext", 'data-mini': "true", 'data-inline': "true"});
            audioDiv.append(audioBtn);
            
            disconnectDiv = $("<div>", {class: 'ui-block-d', style: 'margin-top: 15px'});
            disconnectBtn = $("<input>", {type: "button", id: "disconnectBtn", 'data-icon': "delete", 'data-iconpos': "notext", 'data-mini': "true", 'data-inline': "true"});
            disconnectDiv.append(disconnectBtn);
            
            nextDiv = $("<div>", {class: 'ui-block-e'});
            nextBtn = $("<input>", {type: "button", id: "nextBtn", 'data-icon': "carat-r", 'data-iconpos': "notext", 'data-mini': "true", 'data-inline': "true"});
            nextDiv.append(nextBtn);
            
            controlForm.append(backDiv);
            controlForm.append(audioDiv);
            controlForm.append(playListDiv);
            controlForm.append(disconnectDiv);
            controlForm.append(nextDiv);
            
            formItem.append(controlForm);
            
            remoteDiv.append(formItem);
            contentItem.append(remoteDiv);
            
            pageItem.append(contentItem);
            
            var footerItem = ui.renderFooter();
            pageItem.append(footerItem);

            $("body").append(pageItem);
        };
        
        ui.renderFooter = function() {
            var divItem = $("<div>", {'data-role': 'footer', 'data-position': 'fixed'});
            var navItem = $("<nav>", {'data-role': 'navbar'});
            var ulItem = $("<ul>");
            
            var liItem2 = $("<li>");
            var aItem2 = $("<a>", {'data-icon': 'home', href: '#remotePage'});
            liItem2.append(aItem2);
                
            var liItem3 = $("<li>");
            var aItem3 = $("<a>", {'data-icon': 'plus', href: '#playListPage'});
            liItem3.append(aItem3);
                
            ulItem.append(liItem2);
            ulItem.append(liItem3);
                
            navItem.append(ulItem);
            divItem.append(navItem);
            return divItem;
        };
        
        ui.renderHeader = function() {
            var divItem = $("<div>", {'data-role': 'header', 'data-position': 'fixed'});
            var tableItem = $("<table>", {style: "width: 100%"});
            
            var td1 = $("<td>", {style: "width: 75%; padding: 0px; margin: 0px"});
            var heading = $("<h1>", {style: 'margin: 0 auto; font-family: "pacificoregular"'}).text("MoboRemote");
            td1.append(heading);
            tableItem.append(td1);
            
            var td2 = $("<td>", {style: "padding: 0px; margin: 0px"});
            var logo = $("<img>", {style: "margin: 0 auto; height: 35px; float: right", src: "css/images/logo.png"});
            td2.append(logo);
            tableItem.append(td2);
            
            divItem.append(tableItem);
            
            return divItem;
        };
        
		ui.init = function() {    
            ui.render();
            
            console.log("ui.init");
            ui.volInput = $('#volume').val(50).slider();
            ui.volumeLog = 50;
                        
            ui.playPauseBtn = $('#playPause');
            ui.playPauseImg = $('#playPauseImg');
            
            ui.nextBtn = $('#nextBtn');
            ui.backBtn = $('#backBtn');
                                    
            ui.carousel = $("#carousel");
            ui.list = $("#carousel ul");
            
            ui.connectForm = $("#connectForm").collapsible();
            
            ui.disconnectBtn = $("#disconnectBtn");
            ui.playListBtn = $("#playListBtn");
            ui.audioBtn = $("#audioBtn");
            
            ui.registerEvents();
            
            ui.initCarousel();
            
            ui.enable(false);
	};
        
        ui.enable = function(value) {
            var contentDiv = $("#remoteDiv"); //$("#remotePage['data-role'='content']");
            if (value) {
                contentDiv.show();
                $("#connectForm").collapsible("collapse");
            }
            else {
                contentDiv.hide();
                $("#connectForm").collapsible("expand");
            }
            ui.setPlayPause(false);
        };
        
		ui.registerEvents = function() {
                ui.playPauseBtn.on('click', ui.clickPlayPauseBtn);
                ui.backBtn.on('click', ui.clickBack);
                ui.nextBtn.on('click', ui.clickNext);
                
                ui.volInput.on('change', ui.changeVolumeSlider);
                
                //// carousel events /////// 
                ui.carousel.on("swiperight", ui.clickBack);
                ui.carousel.on("swipeleft", ui.clickNext);
                ui.list.on('click', 'li a', ui.clickItem);
                
                // device orientation 
                $( window ).on( "orientationchange resize", function(event) {
                    console.log("orientation change");
                    ui.initCarousel();
                });
                
                ui.playListBtn.on("click", ui.goPlayList);
                ui.audioBtn.on("click", ui.clickAudioBtn);
	};
        /////////// transitions /////////////
        
        ui.goPlayList = function(event) {
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
			if (!control.videoId)
				return;
			//$.mobile.loading('show');

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
                       
            control.updateByUi("volume", volume);
        };
        
        ui.clickAudioBtn = function() {
            var volume = parseInt(ui.volInput.val());
            if (volume > 0) {
                ui.volumeLog = volume;
                volume = 0;
            }
            else {
                volume = ui.volumeLog;
            }
            
            ui.setVolume(volume);
            
            control.updateByUi("volume", volume);
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
                    //ui.setSpeaker(value);
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
                //var imgSrc = $("#pauseUri").attr('src');
                ui.playPauseImg.attr('src', "css/images/pause.png");//imgSrc);
            }
            else {
                ui.playPauseBtn.attr('data-play', "pause");
                ui.playPauseImg.attr('src', "css/images/play.png");
            }
        };
        
        ui.setVolume = function(volume) {            
            ui.volInput.val(volume).slider('refresh');
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
            
            var images = ui.list.children(); 
            
            images.css({width: ui.imageWidth});
            
            var imgNum = images.size();
            
            var totalWidth = ui.imageWidth * imgNum;
            ui.list.css({width: totalWidth});            
        };
            
        ui.addToCarousel = function(videoId) {
            var item = $("<li>", {'data-videoId': videoId});
            var link = $("<a>", {href: '#'});
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
			$.mobile.loading('show');

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
