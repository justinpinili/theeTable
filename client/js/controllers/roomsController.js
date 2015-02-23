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

		$scope.$parent.showApp = true;

		theeTableRooms.getAllRooms(function(result) {
			$scope.rooms = result.rooms;

			if (theeTableAuth.verifyJwt(true)) {
				$scope.$parent.getUserInfo();
				$scope.$parent.showApp = true;
				$scope.favoriteRooms = [];

				theeTableAuth.getUserInfo(function(user) {
					$scope.favoriteRooms = user.rooms;
				});
			} else {
				$scope.$parent.visitor = true;
			}

		});

		$scope.$parent.$watch('visitor', function(newValue, oldValue) {
			if (newValue === false && newValue !== oldValue) {
				theeTableRooms.getAllRooms(function(result) {
					$scope.rooms = result.rooms;

					if (theeTableAuth.verifyJwt(true)) {
						$scope.$parent.getUserInfo();
						$scope.$parent.showApp = true;
						$scope.favoriteRooms = [];

						theeTableAuth.getUserInfo(function(user) {
							$scope.$parent.currentUser = user;
							$scope.favoriteRooms = user.rooms;
						});
					}
				});
			}
		});

		// routes the user to the correct room
		$scope.navigate = function(roomName) {
			$location.path('/rooms/'+roomName);
		};

		// allows the user to create a new room
		// in it's own modal
		$scope.createRoom = function() {
			var modalInstance = $modal.open({
				templateUrl: './../templates/modals/createRoom.html',
				controller: 'createRoomController',
				size: 'lg',
				resolve: {
					currentSocket: function () {
						return $scope.$parent.socket;
					}
				}
			});
		};

		// removes an entry from the rooms list
		$scope.remove = function(index) {
			$.snackbar({content: "<span class='glyphicon glyphicon-trash big-icon'></span> " + $scope.favoriteRooms[index] + " has been removed to your favorite rooms list" });
			$scope.favoriteRooms.splice(index, 1);
			var rooms = [];
			for (var index = 0; index < $scope.favoriteRooms.length; index++) {
				rooms.push($scope.favoriteRooms[index]);
			}
			$scope.$parent.socket.emit('newRooms', { rooms: rooms });
		}

	}]);
