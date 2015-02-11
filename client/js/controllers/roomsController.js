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

		$scope.placeholder = {};
		$scope.placeholder.prompt = "Send a Message";

		$scope.roomSearch = {};

	}]);
