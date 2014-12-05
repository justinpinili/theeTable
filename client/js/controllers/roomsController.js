angular.module('theeTable.controllers')
	.controller('roomsController', function($scope, $http, $location) {

		$scope.rooms = [];

		$http.get('http://localhost:1337/rooms')
			.success(function(result) {
				console.log(result);
				$scope.rooms = result.rooms;
				return;
			})
			.error(function(error) {
				console.log(error);
				return;
			});

		$scope.navigate = function(roomName) {
			$location.path('/rooms/'+roomName);
		}

		$scope.create = function(inputRoomName) {
			$http.post('http://localhost:1337/rooms', {name: inputRoomName})
				.success(function(result) {
					if (!result.message) {
						console.log(result);
						// transfer to rooms lobby
						alert(result.name + " created! Taking you there now.")
						$location.path("/rooms/"+result.name);
						return;
					}
					$scope.message = result.message;
					// console.log(result.message);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		};

		$scope.createDisabled = function() {
			if ($scope.room === undefined || $scope.room === '') {
				return true;
			}
			return false;
		};

	});
