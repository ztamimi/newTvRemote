// backEnd object
define(["firebase"], function() {
	var backEnd = {};
        
	backEnd.init = function() {
            var temp = backEnd.url + (backEnd.appName + '/' + backEnd.sessionId  + '/');
            
            backEnd.ref = new Firebase(temp);
            backEnd.dataRef = backEnd.ref.child("data");
            backEnd.listRef = backEnd.ref.child("playList");
            
        };
       
        backEnd.listen = function() {
            backEnd.monitorIdText = $("#monitorId");
            backEnd.monitorIdText.text(backEnd.monitorId);
            backEnd.sessionId = null;
            var temp = backEnd.url + backEnd.appName + '/' + backEnd.monitorId + '/';
            backEnd.monitorRef = new Firebase(temp);
            
            backEnd.monitorRef.update({"connectTo": 0});
            backEnd.monitorRef.update({"status": 0});
            
            backEnd.monitorRef.on('child_changed', backEnd.onStatusChanged);
        };
        
        backEnd.disconnect = function() {
            //$.mobile.changePage("#welcome", {transition: "fade", changeHash: false});
            backEnd.disconnectCallback();
            backEnd.sessionId = null;
            backEnd.monitorRef.update({"connectTo": 0});
            backEnd.monitorRef.update({"status": 0});
            backEnd.ref = null;
            backEnd.dataRef = null;
            backEnd.listRef = null;
        };
        
        backEnd.onStatusChanged = function(snapshot) {
            var value = snapshot.val();
            var key = snapshot.key();
                if (key === 'connectTo' && value !== 0) {
                    backEnd.sessionId = value;
                }
                else if (key === 'status' && value === 1 && backEnd.sessionId !== null) {
                    //$.mobile.changePage("#tv", {transition: "fade", changeHash: false});
                    backEnd.monitorRef.update({"status": 2});
                    backEnd.monitorRef.onDisconnect().update({"status": 0});
                    backEnd.monitorRef.onDisconnect().update({"connectTo": 0});
                    backEnd.init();
                    backEnd.connectCallback();
                }
                else if (key === 'status' && value === 0) {
                    backEnd.disconnect();
                }
        };
        
        backEnd.setConnectCallback = function(callback) {
            backEnd.connectCallback = callback;
        };
        
        backEnd.setDisconnectCallback = function(callback) {
            backEnd.disconnectCallback = callback;
        };
        
        backEnd.updateValue = function(obj) {
            backEnd.dataRef.update(obj);
	};
        
        backEnd.valueUpdated = function(snapshot) {
            var value = snapshot.val();
            var key = snapshot.key();
        
            backEnd.updateValueCallback(key, value);
	};
        
        backEnd.addItem = function(key, value) {
            var obj = {};
            obj[key] = value;
            backEnd.listRef.update(obj);
        };
        
        backEnd.itemAdded = function(snapshot) {
            var value = snapshot.val();
            var key = snapshot.key();
            var task = 'add';
            
            //console.log("backEnd.receiveListAdd " + task + ":" + key);
            backEnd.updateListCallback(task, key, value);
        };
        
        backEnd.deleteItem = function(key) {
            backEnd.listRef.child(key).remove();
        };
        
        backEnd.itemDeleted = function(snapshot) {
            var value = snapshot.val();
            var key = snapshot.key();
            var task = 'delete';
            
            backEnd.updateListCallback(task, key, value);
        };
        
        ////////// set methods ///////////////
        backEnd.setUrl = function(url) {
            backEnd.url = url;
        };
        
        backEnd.setAppName = function(name) {
            backEnd.appName = name;
        };
        
        backEnd.setSessionId = function(sessionId) {
            backEnd.sessionId = sessionId;
        };
        
        backEnd.setMonitorId = function(id) {
            backEnd.monitorId = id;
        };
        
        backEnd.setUpdateValueCallback = function(callback) {
            backEnd.updateValueCallback = callback;
            backEnd.dataRef.on('child_added', backEnd.valueUpdated); 
            backEnd.dataRef.on('child_changed', backEnd.valueUpdated);
        };
        
        backEnd.setUpdateListCallback = function(callback) {
            backEnd.updateListCallback = callback;
            backEnd.listRef.on('child_added', backEnd.itemAdded);
            backEnd.listRef.on('child_removed', backEnd.itemDeleted);
        };
        
    return backEnd;
});