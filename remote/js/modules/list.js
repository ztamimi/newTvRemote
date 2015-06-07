// list object
define(["modules/control", "modules/ui", "jquery", "jqueryMobile"], function(control, ui) {
	var list = {};

        list.render = function() {
            var pageItem = $("<div>", {'data-role': 'page', id: 'playListPage', 'data-theme': 'b'});
            var header = ui.renderHeader();
            pageItem.append(header);
            var headerItem = $("<div>");
            var formItem = $("<form>");
            var tableItem = $("<table>");
            var tdItem = $("<td>", {width: '90%'});
            var inputItem1 = $("<input>", {type: 'url', id: 'url', placeholder: 'copy the url of a youtube video here...', 'data-mini': 'true', 'data-inline': 'true'});
            tdItem.append(inputItem1);
            tableItem.append(tdItem);
            
            var tdItem2 = $("<td>");
            var inputItem2 = $("<input>", {'type':'button', id:'addUrl', value:'Add Video', 'data-mini': 'true', 'data-inline': 'true', 'data-icon': 'plus', 'data-iconpos': 'notext'});
            tdItem2.append(inputItem2);
            tableItem.append(inputItem2);
            formItem.append(tableItem);
            headerItem.append(formItem);
            pageItem.append(headerItem);
            
            var contentItem = $("<div>", {'data-role': 'content'/*, 'data-theme': 'b'*/});
            var ulItem = $("<ul>", {id: 'videoList', 'data-role': 'listview', class: 'ui-overlay-shadow', 'data-split-icon': 'delete'});
            contentItem.append(ulItem);
            pageItem.append(contentItem);
            var footerItem = ui.renderFooter();
            pageItem.append(footerItem);
            
            $('body').append(pageItem);
        };
        
	list.init = function() {
            list.render();
            list.addUrlBtn = $("#addUrl");
            list.urlInput = $("#url");
            list.videoList = $("#videoList");
            list.videoList.listview();
            
            list.registerEvents();
            
            //list.initVideoList();
            
            list.enable(false);
	};

	list.registerEvents = function() {
            list.addUrlBtn.on("click", list.clickAddVideo);
            list.urlInput.keypress(function( event ) {
                if (event.which == 13) {
                    event.preventDefault();
                    list.clickAddVideo();
                }
            });
            list.videoList.on('click', 'li a.data', list.clickItem);
            list.videoList.on('click', 'li a.delete', list.clickDeleteVideo);
                
            $("#playListPage").on("swiperight", list.goRemote);
            $("#playListPage").on("swipeleft", list.goSearch);
            
	};
        
        /////////// transitions /////////////
        list.goSearch = function() {
            $.mobile.changePage("#searchPage", {transition: "slide", changeHash: false});
        };
        
        list.goRemote = function() {
            $.mobile.changePage("#remotePage", {transition: "slide", changeHash: false, reverse: "true"});
        };
        
        
        list.enable = function(value) {
            if (value) {
                list.videoList.on('click', 'li a.data', list.clickItem);
            }
            else {
                list.videoList.off('click', 'li a.data', list.clickItem);
            }
        };
        
        list.initVideoList = function() {
            list.videoList.listview();
            list.enable(false);
        };
        
        list.highLightItem = function(index) {
            if (!list.videoList)
                return;
            
            list.videoList.find("a").css("background", "none");

            var videoId = control.playList[index];
            var selector = "li[data-videoId=" + videoId + "]";
            var listItem = list.videoList.find(selector);
            listItem.find("a").css("background-color", "#555");
        };
        
        list.clickItem = function() {
            var listItem = $(this).parent("li");
            
            $("#videoList li").find("a").css("background-color", "");
            
            listItem.find("a").css("background-color", "#555");
            ui.setPlayPause(true);

            var videoId = listItem.attr("data-videoId");
            control.clickItem(videoId);
            ui.slide();
            var index = control.playList.indexOf(videoId);
            ui.highLightItem(index);
        };
        
        list.clickAddVideo = function() {
            if (!list.videoList)
                return;
            
            var videoId = list.getVideoId();
            if (!videoId)
                return;
            list.urlInput.value = "";

            if (control.playList.indexOf(videoId) >= 0)  // video already exists
                return;
            else {
                list.addVideo(videoId);
                control.addVideo(videoId);
            }
        };
        
        list.clickDeleteVideo = function() {
            var listItem = $(this).parent('li');
            var videoId = listItem.attr("data-videoId");
            listItem.remove();
            control.deleteVideo(videoId);
            ui.removeCarouselItem(videoId);
        };
        
        list.deleteVideo = function(videoId) {
            //var listItem = $(this).parent('li');
            //var videoId = listItem.attr("data-videoId");
            //listItem.remove();
            //control.deleteVideo(videoId);
            //ui.removeCarouselItem(videoId);
        };
        
        list.getVideoId = function() {
            var url = list.urlInput.val();
            var temp = url.toLowerCase();
            
            if (!url)
                return null;
            
            if (temp.indexOf("youtube.com") >= 0) {
                var param = url.split("?")[1].split("v=")[1].split("&")[0];
                return param;
            }
            
            if (temp.indexOf("youtu.be") >= 0) {
                var param = url.split(".")[1].split("/")[1];
                return param;
            }
            console.log("invalid youtube url");
            return null;
        };
        
        list.addSearchResult = function(videoId, titleText, imgUrl) {
            var item = $("<li>", {'data-videoId': videoId});
            var link = $("<a>", {href: '#', class: 'data'});
            var thumb = $("<img>", {src: imgUrl});
            var title = $("<p></p>").text(titleText);
            var icon = $("<a>", {href:'', class:'delete ui-btn ui-btn-icon-notext ui-icon-delete', title:'Delete'});
            link.append(thumb);
            link.append(title);
            item.append(link);
            item.append(icon);
            item.appendTo("#videoList");
            $("#videoList").listview( "refresh");
            control.addVideo(videoId);
        };

        list.addVideo = function(videoId) {
            
            if (!list.videoList)
                return;
            
            var item = $("<li>", {'data-videoId': videoId});
            var link = $("<a>", {href: '#', class: 'data'});
            var thumb = $("<img>", {src: list.imgUrl});
            var title = $("<p></p>").text(list.videoTitle);
            var icon = $("<a>", {href:'', class:'delete ui-btn ui-btn-icon-notext ui-icon-delete', title:'Delete'});
            link.append(thumb);
            link.append(title);
            item.append(link);
            item.append(icon);
            item.appendTo("#videoList");
            
            var slideImg = ui.addToCarousel(videoId);
            
            list.getVideoInfo(videoId, title, thumb, slideImg);
            $("#videoList").listview( "refresh");
        };
        
        list.getVideoInfo = function (videoId, title, thumb, slideImg) {
            $.getJSON("https://www.googleapis.com/youtube/v3/videos", {
					key: "AIzaSyBceX56re-t1h1JlKgOoAVa3w8S3pxmAX0",
					part: "snippet,statistics",
					id: videoId
				}, function(data) {  
                                    if (data.items.length === 0) {
                                        return;
                                    }
                                    title.text(data.items[0].snippet.title);
                                    thumb.attr("src", data.items[0].snippet.thumbnails.default.url);
                                    slideImg.attr("src", data.items[0].snippet.thumbnails.default.url);
                    }); 
                                
        };    
        
        list.updateListByControl = function(task, videoId) {
            if (task === 'add') 
                list.addVideo(videoId);
            if (task === 'delete')
                list.deleteVideo(videoId);
        };
        
        list.updateValueByControl = function(key, value) {
            switch(key) {
                case "index":
                    list.highLightItem(value);
                    break;
                    
                case "videoId":
                    var index = control.playList.indexOf(value);
                    list.highLightItem(index);
                    break;
            };
        };
        
        list.updateByUi = function(key, value) {
            
            switch(key) {
                case "index":
                    list.highLightItem(value);
                    break;
                    
                case "videoId":
                    var index = control.playList.indexOf(value);
                    list.highLightItem(index);
                    break;
            };
        };
        
        return list;
});