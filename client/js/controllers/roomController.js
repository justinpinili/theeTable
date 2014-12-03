angular.module('theeTable.controllers')
	.controller('roomController', function($scope, $state, $http, $stateParams, $location) {

		var socket = io.connect();

		socket.emit('roomEntered', { room: $stateParams.roomName, user: Date.now()});

		socket.on('usersInRoom', function(data) {
			$scope.$apply(function() {
				$scope.room.users = data.users;
				console.log($scope.room.users);
			});
		});

		$http.get('http://localhost:1337/rooms/'+$stateParams.roomName)
			.success(function(result) {
				if (!result.message) {
					console.log(result);
					$scope.room = result;
					return;
				}
				// $scope.message = result.message;
				console.log(result.message);
				alert(result.message);
				$location.path("/rooms");
				return;
			})
			.error(function(error) {
				console.log(error);
				return;
			});

		// $state.transitionTo('main.subviews');
	});
