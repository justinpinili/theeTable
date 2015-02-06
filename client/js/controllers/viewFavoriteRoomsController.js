angular.module('theeTable.controllers')
.controller('viewFavoriteRoomsController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', '$location', function($scope, $modalInstance, $modal, theeTableAuth, $location) {

	$scope.rooms = [];

	$scope.remove = function(index) {
		$scope.rooms.splice(index, 1);
		var rooms = [];
		for (var index = 0; index < $scope.rooms.length; index++) {
			rooms.push($scope.rooms[index]);
		}
		currentSocket.emit('newRooms', { rooms: rooms });
	}

	$scope.navigate = function(roomName) {
		$location.path('/rooms/'+roomName);
		$modalInstance.close();
	};

	theeTableAuth.getUserInfo(function(user) {
		$scope.rooms = user.rooms;
	});

}]);
