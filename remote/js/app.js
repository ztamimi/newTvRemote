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



require(['modules/utilities', 'modules/dBackend', 'modules/control', 'modules/ui', 'modules/list', 'modules/search'], function(utilities, dBackend, control, ui, list, search) {
    
    $.mobile.changePage("#splashPage", {transition: "fade", changeHash: false});
    
    setTimeout(function(){
        $.mobile.changePage("#remotePage", {transition: "fade", changeHash: false});
        console.log("slide");
    }, 2000);
    
    var id = utilities.getCookie("deviceId");
    if (!id) {
        id = utilities.generateRandomStr(6);
        utilities.setCookie("deviceId", id);
    }
    dBackend.sessionId = id; 
    dBackend.setUrl('https://blazing-heat-3187.firebaseio.com/');
    dBackend.setAppName('tvRemote');
    dBackend.setConnectCallback(onConnect);
    dBackend.setDisconnectCallback(onDisconnect);
    
    function onConnect() {
        ui.enable(true);
        list.enable(true);
    };
    
    function onDisconnect() {
        ui.enable(false);
        list.enable(false);
    };

    list.init();
    ui.init();
    ui.setUpdateByUiCallback(list.updateByUi);
    
    search.init();
    
    control.init();
    control.setUiValueCallback(ui.updateValueByControl);
    control.setUiValueCallback2(list.updateValueByControl);
    control.setUiListCallback(list.updateListByControl);
    
    function onNewDevice() {
        control.set();
    };
    
    dBackend.setNewDeviceCallback(onNewDevice);
    dBackend.init(); 
    dBackend.setUpdateValueCallback(control.updateValueByBackEnd);
    dBackend.setUpdateListCallback(control.updateListByBackEnd);
    
    
    
    
   
});