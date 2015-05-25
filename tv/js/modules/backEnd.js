// backEnd object
define(["firebase"], function() {
	var backEnd = {};
        
	backEnd.init = function() {
            var temp = backEnd.url + (backEnd.appName + '/' + backEnd.sessionId  + '/');
            
            backEnd.ref = new Firebase(temp);
            backEnd.dataRef = backEnd.ref.child("data");
            backEnd.listRef = backEnd.ref.child("playList");
            
        };
        
        backEnd.generateId = function() {
                var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
                var string_length = 6;
                var randomstring = '';
                for (var i=0; i<string_length; i++) {
                        var rnum = Math.floor(Math.random() * chars.length);
                        randomstring += chars.substring(rnum,rnum+1);
                }
                return randomstring;
        };
       
        backEnd.listen = function() {
            backEnd.monitorIdText = $("#monitorId");
            //backEnd.monitorId = "xyz";//backEnd.generateId();
            backEnd.monitorIdText.text(backEnd.monitorId);
            backEnd.sessionId = null;
            var temp = backEnd.url + backEnd.appName + '/' + backEnd.monitorId + '/';
            backEnd.monitorRef = new Firebase(temp);
            
            backEnd.monitorRef.update({"connectTo": 0});
            backEnd.monitorRef.update({"status": 0});
            
            backEnd.monitorRef.on('child_changed', backEnd.onStatusChanged);
        };
        
        backEnd.disconnect = function() {
            $.mobile.changePage("#welcome", "fade");
            backEnd.disconnectCallback();
            backEnd.sessionId = null;
            backEnd.monitorRef.update({"connectTo": 0});
            backEnd.monitorRef.update({"status": 0});
            backEnd.ref = null
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
                    $.mobile.changePage("#tv", "fade");
                    backEnd.monitorRef.update({"status": 2});
                    backEnd.monitorRef.onDisconnect().update({"status": 0});
                    backEnd.monitorRef.onDisconnect().update({"connectTo": 0});
                    backEnd.init();
                    backEnd.connectCallback();
                }
                else if (key === 'status' && value === 3) {
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