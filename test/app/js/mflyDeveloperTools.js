//
// Development Tools for Mediafly Interactives
//
var mflyDeveloperTools = function() {
    var _runHeartbeat = true;
    var _seq = 0;
    var _message = '';
    var _heartbeatId = null;

    $(document).ready(function () {
        console.log("*** YOU ARE USING mflyDeveloperTools.js. While you should be okay, ***");
        console.log("*** please consider removing all traces of this file in production. ***");

        /**
         * Conduct test to identify whether user is in Developer mode or production mode, in case they forgot to comment out this file.
         */
        if (window.location.origin.lastIndexOf('mfly://') !== 0) {
            $.ajax({
                url: window.location.origin + "/_heartbeat?seq=-1",
                success: function (data, textStatus, request) {
                    // They are in developer mode. Looks good, continue.
                },
                error: function (data, status, request) {
                    // They are running on a device. Not good, break out of this function.
                    _runHeartbeat = false;
                }
            });
        } else {
            _runHeartbeat = false;
        }


        /**
         * Heartbeat thread.
         */
        _heartbeatId = setInterval(function() {
            // Check (again) if the timer should be running
            if (window.location.origin.lastIndexOf('mfly://') === 0) {
                _runHeartbeat = false;
            }

            var queryParams = "/_heartbeat?seq=" + _seq;
            if (_message) {
                queryParams = queryParams + '&' + _message;
                _message = '';
            }
            $.ajax({
                url: window.location.origin + queryParams,
                success: function (data, textStatus, request) {
                    eval(data);
                },
                error: function (data, status, request) {
                    console.log("Hearbeat error");
                }
            });
            _seq ++;
            if (!_runHeartbeat && _heartbeatId) clearInterval(_heartbeatId);
        }, 1000);
    });

    /**
     * Public variables and functions
     */
    return {
        setOnlineStatus: function (isOnline) {
            _message = 'isOnline=' + isOnline;
        },

        getMessage: function() {
            return _message;
        }
    };
}();