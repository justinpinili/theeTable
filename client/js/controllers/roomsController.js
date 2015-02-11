angular.module('theeTable.controllers')
	.controller('roomsController', ['$scope', '$location', 'localStorageService', 'theeTableAuth', 'theeTableRooms', '$modal', function($scope, $location, localStorageService, theeTableAuth, theeTableRooms, $modal) {

		/***********************************************************
		 * roomsController allows the user to see what             *
		 * rooms are currently available on Thee Table   					 *
		 *  																										   *
		 * Allows for: 																						 *
		 *  - Creating a new room									                 *
		 *  - navigating to an existing room						           *
		 ***********************************************************/

		// rooms initialization logic

		$scope.rooms = [];
		$scope.roomSearch = {};
		$scope.$parent.userInRoom = false;

		if (theeTableAuth.verifyJwt()) {
			theeTableRooms.getAllRooms(function(result) {
				$scope.rooms = result.rooms;
				$scope.$parent.getUserInfo();
			});
		}

		// routes the user to the correct room
		$scope.navigate = function(roomName) {
			$location.path('/rooms/'+roomName);
		};

		// allows the user to create a new room
		// in it's own modal
		$scope.createRoom = function() {
			var modalInstance = $modal.open({
				templateUrl: './../templates/createRoom.html',
				controller: ['$scope', 'socket','$modalInstance', function($scope, socket, $modalInstance) {
					$scope.socket = socket;
					$scope.$watch('close', function(newValue, oldValue) {
						if (newValue) {
							$modalInstance.close();
						}
					});
					$scope.closeModal = function() {
						$modalInstance.close();
					}
				}],
				size: 'lg',
				resolve: {
					socket: function () {
						return $scope.$parent.socket;
					}
				}
			});
		};

	}]);
