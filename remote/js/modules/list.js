// list object
define(["modules/control", "modules/ui", "jquery", "jqueryMobile"], function(control, ui) {
	var list = {};

        list.render = function() {
            var pageItem = $("<div>", {'data-role': 'page', id: 'playListPage', 'data-theme': 'b'});
            var header = ui.renderHeader();
            pageItem.append(header);
            
            var toolbarDiv = $("<div>");
            var toolbarForm = $("<form>");
            var table = $("<table>", {width: '100%'});
           
            var backToRemoteBtn = $("<td>", {width: '10%'}).append($("<input>", {'type':'button', id:'backToRemoteBtn', value:'back', 'data-mini': 'true', 'data-inline': 'true', 'data-icon': 'back', 'data-iconpos': 'notext'}));
            table.append(backToRemoteBtn);
            
            var actionInput = $("<td>", {width: '80%'}).append($("<input>", {type: 'text', id: 'actionInput', placeholder: 'enter url to keywords ...', 'data-mini': 'true', 'data-inline': 'true'}));
            table.append(actionInput);
            
            var actionBtn = $("<td>", {width: '10%'}).append($("<input>", {'type':'button', id:'actionBtn', value:'Go', 'data-mini': 'true', 'data-inline': 'true', 'data-icon': 'action', 'data-iconpos': 'notext'}));
            table.append(actionBtn);
            
            toolbarForm.append(table);
            toolbarDiv.append(toolbarForm);
            
            pageItem.append(toolbarDiv);
            
            var contentItem = $("<div>", {'data-role': 'content'});
            var ulItem = $("<ul>", {id: 'videoList', 'data-role': 'listview', class: 'ui-overlay-shadow', 'data-split-icon': 'delete'});
            contentItem.append(ulItem);
            pageItem.append(contentItem);
            var footerItem = ui.renderFooter();
            pageItem.append(footerItem);
            
            $('body').append(pageItem);
        };
        
	list.init = function() {
            list.render();
            //list.addUrlBtn = $("#addUrl");
            //list.searchVideoBtn = $("#searchVideo");
            list.actionBtn = $("#actionBtn");
            list.backToRemoteBtn = $("#backToRemoteBtn");
            //list.urlInput = $("#url");
            list.actionInput = $("#actionInput");
            list.videoList = $("#videoList");
            list.videoList.listview();
            
            list.registerEvents();            
            list.enable(false);
	};

	list.registerEvents = function() {
            //list.addUrlBtn.on("click", list.clickAddVideo);
            //list.searchVideoBtn.on("click", list.clickSearchVideo);
            list.actionBtn.on("click", list.clickAddVideo);
            list.backToRemoteBtn.on("click", list.goRemote);
            list.actionInput.keypress(function( event ) {
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
        
        list.clickSearchVideo = function(keyword) {
            //var keyword = list.urlInput.val();
            if (keyword) {
                list.search.setSearchInput(keyword);
                list.search.clickSearch();
                //list.urlInput.val("");
            }
            $("#searchPage").panel("open");
        };
        
        list.clickAddVideo = function() {
            if (!list.videoList)
                return;
            
            var input = list.actionInput.val();
            
            //if (!input)
            //    return;
            
            var videoId = list.getVideoId(input);
            
            list.actionInput.val("");
            
            if (videoId) {
                if (control.playList.indexOf(videoId) >= 0)  // video already exists
                    return;
                
                list.addVideo(videoId);
                control.addVideo(videoId);
            }
            else
                list.clickSearchVideo(input);
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
        
        list.getVideoId = function(url) {
            //var url = list.urlInput.val();
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
            var title = $("<p>", {class: 'title'}).text(titleText);
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
            var link = $("<a>", {class: 'data'});
            var thumb = $("<img>", {src: list.imgUrl});
            var title = $("<p>", {class: 'title'}).text(list.videoTitle);
            var icon = $("<a>", {href:'', class:'delete ui-btn ui-btn-icon-notext ui-icon-delete', title:'Delete'});
            //var desc = $("<p>");
            link.append(thumb);
            link.append(title);
            //link.append(desc);
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
					part: "snippet",
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
        
        list.setSearchPtr = function(searchPtr) {
            list.search = searchPtr;
        };
        
        return list;
});