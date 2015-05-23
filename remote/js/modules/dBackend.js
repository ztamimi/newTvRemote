// dBackend object
define(["firebase"], function() {
	var dBackend = {};
        
	dBackend.init = function() {
            var temp = dBackend.url + (dBackend.appName + '/' + dBackend.sessionId  + '/');
            
            dBackend.ref = new Firebase(temp);
            dBackend.dataRef = dBackend.ref.child("data");
            dBackend.listRef = dBackend.ref.child("playList");
            
            dBackend.connectBtn = $("#connect");
            dBackend.monitorIdInput = $("#monitorId");
            dBackend.connectBtn.on("click", dBackend.clickConnect);  
        };
        
        //// connect //////////
        dBackend.clickConnect = function() {
            var monitorId = dBackend.monitorIdInput.val();
            //$("#connectForm").collapsible("collapse");
            //dBackend.connectTo(monitorId);
            var temp = dBackend.url + dBackend.appName + '/' + monitorId + '/';
            dBackend.monitorRef = new Firebase(temp);
            $.mobile.loading('show');
            dBackend.monitorRef.once('value', function(snapshot) {
                //$("#connectStatus").popup("open", {"positionTo": "#connectForm"});
                if (snapshot.hasChild('connectTo')) {
                    if (snapshot.child('status').val() === 0) {
                        dBackend.monitorRef.update({"connectTo": dBackend.sessionId});
                        dBackend.monitorRef.update({"status": 1});
                        dBackend.monitorRef.on('child_changed', dBackend.onConnect);
                    }
                    else 
                        dBackend.connectError(1)
                }
                else 
                    dBackend.connectError(2);
            });
        };
        
        dBackend.onConnect = function(snapshot) {
            var value = snapshot.val();
            var key = snapshot.key();
            if (key === 'status' && value === 2) {
                //$("#connectStatus").text("successfully connected to monitor");
                dBackend.flip(2);
                /*
                dBackend.connectBtn.off("click", dBackend.clickConnect);
                dBackend.connectBtn.button("option", "icon", "delete");
                dBackend.connectBtn.on("click", dBackend.clickDisconnect);
                */
                //$('#connectStatus').popup("close");
                dBackend.connectError(0);
            }
        };
        
        dBackend.connectError = function(code) {
            $.mobile.loading('hide');
            var message;
            switch (code) {
                case 0:
                    message = "successfully connected to monitor";
                    break;
                case 1:
                    message = "not available to connect";
                    break;
                case 2:
                    message = "invalid monitor id";
                    break;
            };
            
            $("#connectStatus").text(message);
            $("#connectStatus").popup("open", {"positionTo": "#connectForm"});
            setTimeout(function(){$("#connectStatus").popup("close");}, 2000);
        };
        
        dBackend.clickDisconnect = function() {
            dBackend.flip(1);
            /*
            $("#connectForm").collapsible("collapse");
            dBackend.connectBtn.off("click", dBackend.clickDisconnect);
            dBackend.connectBtn.button("option", "icon", "check");
            dBackend.connectBtn.on("click", dBackend.clickConnect);
            */
            //dBackend.disconnect();
            dBackend.monitorRef.update({"status": 3});
            dBackend.monitorRef = null;
        };
        
        dBackend.flip = function(status) {
            if (status === 1) {
                dBackend.connectBtn.off("click", dBackend.clickDisconnect);
                dBackend.connectBtn.button("option", "icon", "check");
                dBackend.connectBtn.on("click", dBackend.clickConnect);
            }
            else if (status === 2) {
                dBackend.connectBtn.off("click", dBackend.clickConnect);
                dBackend.connectBtn.button("option", "icon", "delete");
                dBackend.connectBtn.on("click", dBackend.clickDisconnect);
            }
            $("#connectForm").collapsible("collapse");
        };
        
        /*
        dBackend.connectTo = function(monitorId) {
            var temp = dBackend.url + dBackend.appName + '/' + monitorId + '/';
            dBackend.monitorRef = new Firebase(temp);
            dBackend.monitorRef.on('child_added', dBackend.onConnect);
        };
        
        dBackend.disconnect = function() {
            dBackend.monitorRef.update({"connectTo": 0});
            dBackend.monitorRef = null;
        };
        */
        
        
        dBackend.updateValue = function(obj) {
            dBackend.dataRef.update(obj);
	};
        
        dBackend.valueUpdated = function(snapshot) {
            var value = snapshot.val();
            var key = snapshot.key();
        
            dBackend.updateValueCallback(key, value);
	};
        
        dBackend.addItem = function(key, value) {
            var obj = {};
            obj[key] = value;
            dBackend.listRef.update(obj);
        };
        
        dBackend.itemAdded = function(snapshot) {
            var value = snapshot.val();
            var key = snapshot.key();
            var task = 'add';
            
            //console.log("dBackend.receiveListAdd " + task + ":" + key);
            dBackend.updateListCallback(task, key, value);
        };
        
        dBackend.deleteItem = function(key) {
            dBackend.listRef.child(key).remove();
        };
        
        dBackend.itemDeleted = function(snapshot) {
            var value = snapshot.val();
            var key = snapshot.key();
            var task = 'delete';
            
            dBackend.updateListCallback(task, key, value);
        };
        
        ////////// set methods ///////////////
        dBackend.setUrl = function(url) {
            dBackend.url = url;
        };
        
        dBackend.setAppName = function(name) {
            dBackend.appName = name;
        };
        
        dBackend.setSessionId = function(sessionId) {
            dBackend.sessionId = sessionId;
        };
        
        dBackend.setUpdateValueCallback = function(callback) {
            dBackend.updateValueCallback = callback;
            dBackend.dataRef.on('child_added', dBackend.valueUpdated); 
            dBackend.dataRef.on('child_changed', dBackend.valueUpdated);
        };
        
        dBackend.setUpdateListCallback = function(callback) {
            dBackend.updateListCallback = callback;
            dBackend.listRef.on('child_added', dBackend.itemAdded);
            dBackend.listRef.on('child_removed', dBackend.itemDeleted);
        };
        
    return dBackend;
});