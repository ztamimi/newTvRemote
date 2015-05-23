// connect object
define(["backEnd"], function(backEnd) {
	var connect = {};
        
        /* model
            myId
                |
                |___ available          /// 0: not available, 1: available
                |
                |___ status             /// 0: no connection, 1: request connection, 2: accept connection, 3: disconnect
                |
                |___ deviceId
                
            
        */
        
	connect.init = function() {
            /// connect.myId = getCookie("myId");
            /// if (!connect.myId)
                // connect.myId = generateRandom();
            
            /// connect.myRef = new firebase(url + app + myId);

            /// connect.reset
            
            /// connect.myRef.child('status').on('child_update', onStatusChange);
        };
        
        connect.reset = function() {
            /// connect.available = 1 (available)
            /// connect.deviceId = 0 (none)
            /// connect.status = 0 (no connection)
                        
            /// connect.connectRef.update({available: connect.available});
            /// connect.myRef.update({deviceId: connect.deviceId});
            /// connect.myRef.update({status: connect.status});
            
            /// set path to myId
            /// listen to event on status
        };
       
        connect.attemptRequest = function(id, callback) {
            /// connect.deviceId = id;
            /// tempRef = new firebase (url + app);
            /// tempRef.once('value'), function(snapshot) {
            ///     if(snapshot.hasChild(id))
            ///         callback(true);
            ///     else
            ///         callback(false);
            /// }
        };
        
        connect.request = function(flag) {
            /// if (!flag) {
            ///     connect.reset();
            ///     console.log("invalid deviceId");
            ///     return;
            /// }
            /// 
            /// connectRef = new firebase(url + app + connect.deviceId);
            /// connectRef.child("available").once('value', function(snapshot) {
            ///     if (snapshot.val() === 0) {
            ///         console.log("device not available");
            ///         return;
            ///     }
            ///     connect.status = 1;
            ///     connectRef.send({deviceId: myId});
            ///     connectRef.send({status: connect.status});
            ///     connectRef.child('status').on('child_update', onStatusChange));
            /// }
        };
        
        connect.disconnect = function() {
            /// connect.status = 3 (disconnect)
            /// connectRef.send({status: connect.status});
            /// connect.reset();
        };
        
        connect.onStatusChange = function() {
            /// if req status is init (1 === init conn)
                // set connectTo ==> reqId
                // set status ==> 1 (not available)
                // set backend event listener for data and list to connectTo
                // set req status ==> 2 (accept conn)
            
            /// if req status is accept (2 === accept conn)
                // set event listeners to list and data
                // set status to 1 (not available)
                // set req status to 3 (connected)
                
            /// if req status is disconnect (4)
                // reset connect
                // remove event listeners for data and list
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