// utilities object
define([""], function() {
    var utilities = {};
    
    utilities.init = function() {
        utilities.resetBtn = $("#resetBtn");
        utilities.resetBtn.on("click", utilities.reset);
    };
    
    utilities.reset = function() {
        console.log("reset");
        var id = utilities.generateRandomStr(5);
        utilities.setCookie("monitorId", id);
        location.reload();
    };
        
    utilities.setCookie = function(key, value) {  
        var expires = new Date();  
        expires.setTime(expires.getTime() + 31536000000); //1 year  
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();  
    };
  
    utilities.getCookie = function(key) {  
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');  
        return keyValue ? keyValue[2] : null;  
    };
    
    utilities.generateRandomStr = function(length) {
                var chars = "0123456789abcdefghiklmnopqrstuvwxyz";
                var string_length = 6;
                
                if (length)
                    string_length = length;
                
                var randomstring = '';
                for (var i=0; i<string_length; i++) {
                        var rnum = Math.floor(Math.random() * chars.length);
                        randomstring += chars.substring(rnum,rnum+1);
                }
                return randomstring;
        };
    return utilities;
});
