angular.module('theeTable.controllers')
.controller('createRoomController', ['$scope', '$modalInstance', 'currentSocket', 'theeTableRooms', function($scope, $modalInstance, currentSocket, theeTableRooms) {

	/************************************************************
	 * createRoomController handles room creation               *
	 ************************************************************/

	// closes modal
	$scope.closeModal = function() {
		$modalInstance.close();
	};

	$scope.room = {};

	// notify the DB of the user's new room name
	$scope.create = function(newValue) {

		newValue = newValue || $('#room-name').val();

		if (newValue === '' || newValue === undefined) {
			$scope.message = 'Your new room cannot have a blank name.';
			return;
		}

		theeTableRooms.createRoom(newValue, function(result) {
			if (!result.message) {
				currentSocket.emit("addRoom", {room: result.name});
				return;
			}

			$scope.message = result.message;
			return;
		});

		$scope.room.value = '';
		$('#room-name').val('');

		return;
	};

}]);
