// utilities object
define([""], function() {
    var utilities = {};
        
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
                var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
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