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
			$scope.rooms = result.rooms || [];

			if (theeTableAuth.verifyJwt(true)) {
				$scope.$parent.getUserInfo();
				$scope.$parent.showApp = true;
				$scope.favoriteRooms = [];

				theeTableAuth.getUserInfo(function(user) {
					$scope.favoriteRooms = user.rooms;
				});
			} else {
				$.snackbar({content: "You must be logged in to access Thee Table." });
				$location.path('/home');
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
				templateUrl: './js/rooms/createRoom.html',
				controller: 'createRoomController',
				size: 'lg',
				resolve: {
					currentSocket: function () {
						return $scope.$parent.socket;
					}
				}
			});
		};

	}]);
