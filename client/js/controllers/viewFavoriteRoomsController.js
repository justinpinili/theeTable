// angular.module('theeTable.controllers')
// .controller('viewFavoriteRoomsController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', '$location', 'currentSocket', function($scope, $modalInstance, $modal, theeTableAuth, $location, currentSocket) {
//
// 	/************************************************************
// 	 * viewFavoriteRoomsController allows the user to see what  *
// 	 * rooms are on the their favorite room's list.							*
// 	 * 																													*
// 	 * users can navigate directly from this page as well       *
// 	 ************************************************************/
//
// 	// modal initialiazation logic
//
// 	$scope.rooms = [];
//
// 	theeTableAuth.getUserInfo(function(user) {
// 		$scope.rooms = user.rooms;
// 	});
//
// 	// removes an entry from the rooms list
// 	$scope.remove = function(index) {
// 		$.snackbar({content: "<span class='glyphicon glyphicon-trash big-icon'></span> " + $scope.rooms[index] + " has been removed to your favorite rooms list" });
// 		$scope.rooms.splice(index, 1);
// 		var rooms = [];
// 		for (var index = 0; index < $scope.rooms.length; index++) {
// 			rooms.push($scope.rooms[index]);
// 		}
// 		currentSocket.emit('newRooms', { rooms: rooms });
// 	}
//
// 	// routes the current user to the chosen room
// 	$scope.navigate = function(roomName) {
// 		$location.path('/rooms/'+roomName);
// 		$modalInstance.close();
// 	};
//
// 	// closes modal
// 	$scope.close = function() {
// 		$modalInstance.close();
// 	}
// }]);
