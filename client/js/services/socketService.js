angular.module('theeTable.services')
	.factory('socket', ['$rootScope', function($rootScope) {

		/************************************************************
		 * socket factory creates a socket.io connection and have   *
		 * two primary functions.                                  	*
		 *                                                          *
		 * On (listener for events)                                 *
		 * Emit (sends an event)                                    *
		 ************************************************************/

		// connect to socket.io
		var socket = io.connect();

		// listen for an event, and apply the callback to the rootscope
		var on = function(eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		};

		// send an event and apply the callback to the rootscope
		var emit = function(eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		};

	  return {
	    on: on,
	    emit: emit
	  };
	}]);
