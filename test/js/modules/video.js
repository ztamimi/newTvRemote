// video object
define(["modules/control", "modules/ui", "jquery", "jquerymobile"], function(control) {
	var video = {};
        
        video.render = function() {
            var pageItem = $("<div>", {'data-role': "page", id: "videoPage", 'data-theme': 'b'});
            
            //var videoPopupDiv = $("<div>", {'data-role':"popup", 'id':"popupVideo", 'data-overlay-theme': "a", 'data-theme': "d", class: "ui-content"});
            var videoIframe = $("<iframe>", {id: "videoIframe", src: "https://www.youtube.com/embed/-iAh4Y-p2Sg"});
            //videoPopupDiv.append(videoIframe);<iframe width="640" height="390" src="https://www.youtube.com/embed/-iAh4Y-p2Sg" frameborder="0" allowfullscreen></iframe>
            
            var videoPopupBtn = $("<input>", {type: "button", id: "videoPopupBtn", 'data-icon': "video", value: "play video"});
            
            var contentItem = $("<div>", {'data-role': "content", class: "noMargins"});

            contentItem.append(videoIframe);
            contentItem.append(videoPopupBtn);
            pageItem.append(contentItem);
            
            $("body").append(pageItem);
        };
        
        video.scale = function ( width, height, padding, border ) {
            var scrWidth = $( window ).width() - 30,
            scrHeight = $( window ).height() - 30,
            ifrPadding = 2 * padding,
            ifrBorder = 2 * border,
            ifrWidth = width + ifrPadding + ifrBorder,
            ifrHeight = height + ifrPadding + ifrBorder,
            h, w;

            if ( ifrWidth < scrWidth && ifrHeight < scrHeight ) {
                w = ifrWidth;
                h = ifrHeight;
            } else if ( ( ifrWidth / scrWidth ) > ( ifrHeight / scrHeight ) ) {
                w = scrWidth;
                h = ( scrWidth / ifrWidth ) * ifrHeight;
            } else {
                h = scrHeight;
                w = ( scrHeight / ifrHeight ) * ifrWidth;
            }

            return {
                'width': w - ( ifrPadding + ifrBorder ),
                'height': h - ( ifrPadding + ifrBorder )
            };
        };
        
	video.init = function() {            
            video.render();
            $("videoIframe").attr("allowfullscreen", true);
            //var w = $(window).width();
            //var h = $(window).height();
            //$("#videoIframe").attr("width", w);//.attr( "height", h);
            
            //$("#videoPopupBtn").on("click", video.popVideo);
	};
        
        /////////// ui methods //////////////
        video.popVideo = function() {
            $("#popupVideo").popup("open");
        };
        
    return video;
});