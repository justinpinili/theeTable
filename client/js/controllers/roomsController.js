angular.module('theeTable.controllers')
	.controller('roomsController', ['$scope', '$location', 'localStorageService', 'theeTableAuth', 'theeTableRooms', '$modal', function($scope, $location, localStorageService, theeTableAuth, theeTableRooms, $modal) {

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

		$scope.createRoom = function() {
			var modalInstance = $modal.open({
				templateUrl: './../templates/createRoom.html',
				controller: ['$scope', 'socket','$modalInstance', function($scope, socket, $modalInstance) {
					$scope.socket = socket;
					$scope.$watch('close', function(newValue, oldValue) {
						console.log("newValue", newValue)
						if (newValue) {
							$modalInstance.close();
						}
					});
				}],
				size: 'sm',
				resolve: {
					socket: function () {
						return $scope.$parent.socket;
					}
				}
			});
		};

		$scope.roomSearch = {};

	}]);
