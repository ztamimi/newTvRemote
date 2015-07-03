require.config({
    baseUrl: 'js',
    
    paths: {
        "firebase": "http://cdn.firebase.com/js/client/2.2.2/firebase",
        "jquery": "http://code.jquery.com/jquery-1.11.1.min",
        "jqueryMobile": "http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min"
    }
});

requirejs(["jquery"]);
requirejs(["jqueryMobile"]);

require(['modules/utilities', 'modules/backEnd', 'modules/tv', 'modules/ytplayer'], function(utilities, backEnd, tv, ytplayer) {
   
    backEnd.setUrl('https://blazing-heat-3187.firebaseio.com/');
    backEnd.setAppName('tvRemoteTest');
    
    utilities.init();
    
    var id = utilities.getCookie("monitorId");
    if (!id) {
        id = utilities.generateRandomStr(5);
        utilities.setCookie("monitorId", id);
    }
    backEnd.setMonitorId(id);
    
    backEnd.listen();
    backEnd.setConnectCallback(onConnect);
    backEnd.setDisconnectCallback(onDisconnect);
    $.mobile.changePage("#welcomePage", {transition: "fade", changeHash: false});

    
    
    function onConnect() {
        ytplayer.init();
        ytplayer.setPlayerLoadedCallback(init);
        $.mobile.changePage("#tvPage", {transition: "fade", changeHash: false});
    };
    
    function onDisconnect() {
        ytplayer.cleanup();
        $.mobile.changePage("#welcomePage", {transition: "fade", changeHash: false});
    };
    
    function init() {
        console.log("player loaded **************");
    
        tv.setUiValueCallback(ytplayer.updateValueByTv);
        tv.setUiListCallback(ytplayer.updateListByTv);
    
        tv.init();
    
        backEnd.setUpdateValueCallback(tv.updateValueByBackEnd);
        backEnd.setUpdateListCallback(tv.updateListByBackEnd);
}
});