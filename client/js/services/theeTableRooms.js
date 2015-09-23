angular.module('theeTable.services')
	.factory('theeTableRooms', ['$http', 'localStorageService', '$location', 'theeTableUrl', '$q', function($http, localStorageService, $location, theeTableUrl, $q) {

		/************************************************************
		 * theeTableRooms obtains all room information used in the  *
		 * application.                                            	*
		 *                                                          *
		 * Obtain all rooms                                         *
		 * Create a new room                                        *
		 * Obtain a single room's information                       *
		 ************************************************************/

		var jwt = localStorageService.get("jwt");

		// Obtain all rooms
		var getAllRooms = function(callback) {
			$http.get("" + theeTableUrl.getUrl() + '/rooms')
				.success(function(result) {
					callback(result);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		};

		// Create a new room
		var createRoom = function(roomName, callback) {
			$http.post("" + theeTableUrl.getUrl() + '/rooms?jwt_token='+jwt, {name: roomName})
				.success(function(result) {
					if (!result.message) {
						callback(result);
						// transfer to rooms lobby
						$location.path("/rooms/"+result.name);
						return;
					}
					callback(result);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		};

		// Get a specific room's information
		var getRoomInfo = function(roomName) {

			if (roomName === '') {
				$location.path("/rooms");
				return;
			}

			var deferred = $q.defer();

			$http.get("" + theeTableUrl.getUrl() + '/rooms/'+roomName)
				.success(function(result) {
					if (!result.message) {
						deferred.resolve(result);
						return;
					}
					alert(result.message);
					$location.path("/rooms");
				})
				.error(function(error) {
					console.log(error);
				});

			return deferred.promise;
		};

		return {
			getAllRooms: getAllRooms,
			createRoom: createRoom,
			getRoomInfo: getRoomInfo
		};
	}]);
