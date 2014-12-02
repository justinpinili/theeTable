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
			if ($scope.roomForm.roomName.$error.required === undefined) {
					$scope.roomFeedback = {error: false, class: 'has-success'};
					$scope.buttonFeedback = "btn-success";
					return false;
				}
			return true;
		};

		$scope.roomFeedback = {error: null, class: ' '};
		$scope.buttonFeedback = "btn-default";

		$scope.dirtyAndInvalid = function(dirty, invalid, input) {
			if (dirty === true && invalid === true) {
				$scope.roomFeedback.error = true;
				$scope.roomFeedback.class = "has-error";
				$scope.buttonFeedback = "btn-default";
				return true;
			}
			return false;
		};

	});
