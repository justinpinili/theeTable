angular.module('theeTable.controllers')
	.controller('roomsController', function($scope, $http, $location, localStorageService, theeTableAuth, theeTableRooms) {

		$scope.rooms = [];
		if (theeTableAuth.verifyJwt()) {
			theeTableRooms.getAllRooms(function(result) {
				$scope.rooms = result.rooms;
				$scope.$parent.getUserInfo();
			});
		};

		$scope.navigate = function(roomName) {
			$location.path('/rooms/'+roomName);
		};

		$scope.newRoom = {};

		$scope.create = function(inputRoomName) {
			theeTableRooms.createRoom(inputRoomName, function(result) {
				$scope.message = result.message;
				$scope.newRoom.room = '';
			});
		};

		$scope.createDisabled = function() {
			if ($scope.newRoom.room === undefined || $scope.newRoom.room === '') {
				return true;
			}
			return false;
		};

	});
