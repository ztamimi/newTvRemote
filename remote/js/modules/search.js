// search object
define(["modules/list", "modules/ui", "jquery", "jqueryMobile"], function(list, ui) {
    var search = {};
    
    search.render = function() {
        var pageItem = $("<div>", {'data-role': "panel", id: "searchPage", 'data-position': "right", 'data-display':"overlay", 'data-theme': 'b'});
        
        var toolbarDiv = $("<div>");
        var toolbarForm = $("<form>");
        var table = $("<table>", {width: "100%"});
            
        var backToListBtn = $("<td>", {width: "10%"}).append($("<input>", {type: "button", id: "backToListBtn", value: "back", 'data-mini': 'true', 'data-inline': 'true', 'data-icon': 'back', 'data-iconpos': 'notext'}));
        table.append(backToListBtn);
        
        var searchInput = $("<td>", {width: "80%"}).append($("<input>", {id: "searchInputId", placeholder: 'enter search keywords...', type: "text"}));
        table.append(searchInput);
            
        var searchBtn = $("<td>", {width: "10%"}).append($("<input>", {type: "button", id: "searchBtnId", value: "search", 'data-mini': 'true', 'data-inline': 'true', 'data-icon': 'search', 'data-iconpos': 'notext'}));
        table.append(searchBtn);
            
        toolbarForm.append(table);
        toolbarDiv.append(toolbarForm);
        pageItem.append(toolbarDiv);
            
        var contentItem = $("<div>", {'data-role': "content"});
        contentItem.append($("<ul>", {id: "searchResult", 'data-role': "listview", class: "ui-overlay-shadow", 'data-split-icon': "plus"}));
        pageItem.append(contentItem);
            
        var divItem = $("<div>", {id: "searchItemAdded", 'data-role': "popup", 'data-theme': "none", 'data-overlay-theme': "b", 'data-transition': "fade", class: "ui-content popup_message"});
        divItem.text("item added");
        pageItem.append(divItem);
        
        var itemDesc = $("<div>", {id: "itemDesc", 'data-role': "popup", 'data-theme': "a", 'data-overlay-theme': "b", 'data-transition': "slide", class: "ui-content"});
        var closeBtn = $("<a>", {href: "#", id: "closeDescBtn", 'data-role': "button", 'data-theme': "a", 'data-icon': "delete", 'data-iconpos': "notext", 'class': "ui-btn-left"});
        itemDesc.append(closeBtn);
        itemDesc.append($("<p>", {class: 'title'}));
        itemDesc.append($("<br>"));
        itemDesc.append($("<p>", {class: 'desc'}));
        pageItem.append(itemDesc);
        
        $("#playListPage").append(pageItem);
    };
    
    search.init = function() {
        search.render();
        search.list = $("#searchResult");
        search.searchInput = $("#searchInputId");
        search.searchBtn = $("#searchBtnId");
        search.backToListBtn = $("#backToListBtn");
        //$("#searchPage").panel();
    
        search.searchBtn.on('click', search.clickSearch);
        search.searchInput.keypress(function( event ) {
            if (event.which == 13) {
                event.preventDefault();
                search.clickSearch();
            }
        });
        search.backToListBtn.on('click', search.clickGoToList);

        search.list.on('click', 'li a.add', search.clickAddVideo);
        search.list.on('click', 'li a.data', search.clickItem);
        $("#closeDescBtn").on("click", search.clickCloseDesc);
        $('#searchItemAdded').on("popupafteropen", function(event, ui) {
            $('#searchItemAdded').popup("close");
            $.mobile.changePage("#searchPage", {transition: "none", changeHash: false});
        });
    };
    
    search.clickGoToList = function() {
        $("#searchPage").panel("close");
    };
    
    search.clickCloseDesc = function() {
        $("#itemDesc").popup("close");
        $.mobile.changePage("#searchPage", {transition: "none", changeHash: false});
    };
    
    search.clickSearch = function() {
        var keyword = search.searchInput.val();
        if (!keyword)
            return;
        console.log(keyword);
        search.list.empty();
        search.search(keyword);
    };
    
    search.setSearchInput = function(keyword) {
        search.searchInput.val(keyword);
    };
    
    search.clickItem = function() {
        var item = $(this).parent('li');
        var title = item.find($("p[class='title']"));
        var desc = item.find($("p[class='desc']"));
        
        $("#itemDesc").find("p[class='title']").text(title.text());
        $("#itemDesc").find("p[class='desc']").text(desc.text());
        $('#itemDesc').popup('open');
    };
    
    search.clickAddVideo = function() { 
        var searchItem = $(this).parent('li');
        var videoId = searchItem.attr("data-videoId");
        var title = searchItem.find("p[class='title']").text();
        var imgUrl = searchItem.find("img").attr("src");
        list.addSearchResult(videoId, title, imgUrl);
        ui.addSearchResult(videoId, title, imgUrl);
        
        $(this).attr('class', 'ui-btn ui-btn-icon-notext ui-icon-check');
        
        $("<a>", {href:'#searchItemAdded', 'data-transition':'slideup', 'data-rel':'popup', class:'add ui-btn ui-btn-icon-notext ui-icon-plus', title:'Add'});
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
                                        var title = $("<p>", {class: 'title'}).text(searchList[i].snippet.title);
                                        var desc = $("<p>", {class: 'desc'}).text(searchList[i].snippet.description);
                                        var icon = $("<a>", {href:'#searchItemAdded', 'data-transition':'slideup', 'data-rel':'popup', class:'add ui-btn ui-btn-icon-notext ui-icon-plus', title:'Add'});
                                        link.append(thumb);
                                        link.append(title);
                                        link.append(desc);
                                        item.append(link);
                                        item.append(icon);
                                        
                                        search.list.append(item);                                        
                                    }
                                    search.list.listview("refresh");
                    });                                 
    };
    
    return search;
});