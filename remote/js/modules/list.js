// list object
define(["modules/control", "modules/ui", "jquery"], function(control, ui, $) {
	var list = {};

	list.init = function() {
            list.addUrlBtn = document.getElementById("addUrl");
            list.urlInput = document.getElementById("url");
            list.videoList = $("#videoList");
            
            list.registerEvents();
            
            list.initVideoList();
	};

	list.registerEvents = function() {
            list.addUrlBtn.addEventListener("click", list.clickAddVideo, false);
            list.videoList.on('click', 'li a.data', list.clickItem);
            list.videoList.on('click', 'li a.delete', list.clickDeleteVideo);
	};
        
        list.initVideoList = function() {
            list.videoList.listview();
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
            var url = list.urlInput.value;
            var temp = url.toLowerCase();
            
            if (!url)
                return;
            
            if (temp.indexOf("youtube.com") >= 0) {
                var param = url.split("?")[1].split("v=")[1].split("&")[0];
                return param;
            }
            
            if (temp.indexOf("youtu.be") >= 0) {
                var param = url.split(".")[1].split("/")[1]
                return param;
            }

            console.log("invalid youtube url");
            return;
            //var temp = url.split("://")[1];
            //if (!temp)
            //    return;
            //var site = temp.split("?")[0];
            //var site = url.split(".")[1];
            //if (site.toLowerCase() !== "youtube") 
            
            
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