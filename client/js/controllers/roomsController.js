angular.module('theeTable.controllers')
	.controller('roomsController', ['$scope', '$location', 'localStorageService', 'theeTableAuth', 'theeTableRooms', function($scope, $location, localStorageService, theeTableAuth, theeTableRooms) {

		$scope.rooms = [];
		if (theeTableAuth.verifyJwt()) {
			theeTableRooms.getAllRooms(function(result) {
				$scope.rooms = result.rooms;
				$scope.$parent.getUserInfo();
			});
		}

		$scope.navigate = function(roomName) {
			$location.path('/rooms/'+roomName);
		};

		$scope.newRoom = {};

		$scope.create = function(inputRoomName) {
			theeTableRooms.createRoom(inputRoomName, function(result) {
				if (!result.message) {
					$scope.$parent.socket.emit("addRoom", {room: result.name});
					// console.log(result.name);
					return;
				}
				$scope.message = result.message;
				$scope.newRoom.room = '';
				return;
			});
		};

		$scope.createDisabled = function() {
			if ($scope.newRoom.room === undefined || $scope.newRoom.room === '') {
				return true;
			}
			return false;
		};

		$scope.roomSearch = {};

	}]);
