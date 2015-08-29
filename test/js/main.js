define(['modules/utilities', 'modules/dBackend', 'modules/control', "jquery", "jquerymobile", 'modules/list', 'modules/ui', 'modules/search'], function(utilities, dBackend, control, jquery, jquerymobile, list, ui, search) {
    
    return function() {
    var id = utilities.getCookie("deviceId");
    if (!id) {
        id = utilities.generateRandomStr(6);
        utilities.setCookie("deviceId", id);
    }
    dBackend.sessionId = id; 
    dBackend.setUrl('https://blazing-heat-3187.firebaseio.com/');
    dBackend.setAppName('tvRemoteTest');
    dBackend.setConnectCallback(onConnect);
    dBackend.setDisconnectCallback(onDisconnect);
    
    function onConnect() {
        ui.enable(true);
        list.enable(true);
    };
    
    function onDisconnect() {
        ui.enable(false);
        list.enable(false);
        control.set();
    };
    list.init();
    ui.init();

    ui.setUpdateByUiCallback(list.updateByUi);
    
    search.init();
    list.setSearchPtr(search);
    
    $.mobile.changePage("#playListPage", {transition: "slide", changeHash: false, reverse: "true"});
        
    control.init();
    control.setUiValueCallback(ui.updateValueByControl);
    control.setUiValueCallback2(list.updateValueByControl);
    control.setUiListCallback(list.updateListByControl);
    
    function onNewDevice() {
        control.reset();
    };
    
    function onOldDevice() {
    }
    
    dBackend.setNewDeviceCallback(onNewDevice);
    dBackend.setOldDeviceCallback(onOldDevice);

    dBackend.init(); 
    dBackend.setUpdateValueCallback(control.updateValueByBackEnd);
    dBackend.setUpdateListCallback(control.updateListByBackEnd);
    };
});
