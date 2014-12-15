angular.module('theeTable.services')
	.factory('theeTableRooms', function($http, localStorageService, $location) {

		var getAllRooms = function(callback) {
			var jwt = localStorageService.get("jwt");
			$http.get('http://localhost:1337/rooms?jwt_token='+jwt)
				.success(function(result) {
					// console.log(result);
					callback(result);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		};

		var createRoom = function(roomName, callback) {
			var jwt = localStorageService.get("jwt");
			$http.post('http://localhost:1337/rooms?jwt_token='+jwt, {name: roomName})
				.success(function(result) {
					if (!result.message) {
						console.log(result);
						// transfer to rooms lobby
						alert(result.name + " created! Taking you there now.")
						$location.path("/rooms/"+result.name);
						return;
					}
					callback(result);
					// console.log(result.message);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		}

		return {
			getAllRooms: getAllRooms,
			createRoom: createRoom
		};
	});