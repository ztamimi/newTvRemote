// search object
define(["modules/list", "modules/ui"], function(list, ui) {
    var search = {};
    
    search.init = function() {
        search.list = $("#searchResult");
        search.keyword = $("#searchKeyword");
    
        $("#searchBtn").on('click', search.clickSearch);
        search.keyword.keypress(function( event ) {
            if (event.which == 13) {
                event.preventDefault();
                search.clickSearch();
            }
        });
        search.list.on('click', 'li a.add', search.clickAddVideo);
    };
    
    search.clickSearch = function() {
        var keyword = search.keyword.val();
        if (!keyword)
            return;
        console.log(keyword);
        search.list.empty();
        search.search(keyword);
    };
    
    search.clickAddVideo = function() {
        var searchItem = $(this).parent('li');
        var videoId = searchItem.attr("data-videoId");
        var title = searchItem.find("p").text();
        var imgUrl = searchItem.find("img").attr("src");
        list.addSearchResult(videoId, title, imgUrl);
        ui.addSearchResult(videoId, title, imgUrl);
    };
    
    search.search = function (keyword) {
            $.getJSON("https://www.googleapis.com/youtube/v3/search", {
					key: "AIzaSyBceX56re-t1h1JlKgOoAVa3w8S3pxmAX0",
					part: "id,snippet",
					q: keyword,
                                        maxResults: 25,
                                        order: 'viewCount',
                                        type: 'video',
                                        safeSearch: 'moderate'
				}, function(data) {  
                                    if (data.items.length === 0) {
                                        return;
                                    }
                                    var searchList = data.items;
                                    
                                    for (i=0; i < searchList.length; i++) {
                                        var videoId = searchList[i].id.videoId;
                                        console.log(videoId);
                                        var item = $("<li>", {'data-videoId': videoId});
                                        var link = $("<a>", {href: '#', class: 'data'});
                                        var thumb = $("<img>", {src: searchList[i].snippet.thumbnails.default.url});
                                        var title = $("<p></p>").text(searchList[i].snippet.title);
                                        var icon = $("<a>", {href:'#searchItemAdded', 'data-transition':'slideup', 'data-rel':'popup', class:'add ui-btn ui-btn-icon-notext ui-icon-plus', title:'Add'});
                                        link.append(thumb);
                                        link.append(title);
                                        item.append(link);
                                        item.append(icon);
                                        
                                        search.list.append(item);                                        
                                    }
                                    search.list.listview("refresh");
                    });                                 
    };
    
    $('#searchItemAdded').on("popupafteropen", function(event, ui) {$('#searchItemAdded').popup("close")});
    
    return search;
});