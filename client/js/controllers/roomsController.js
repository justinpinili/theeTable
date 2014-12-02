angular.module('theeTable.controllers')
	.controller('roomsController', function($scope, $state, $http, $location) {

		$scope.rooms = [];

		$http.get('http://localhost:1337/rooms')
			.success(function(result) {
				console.log(result);
				$scope.rooms = result.rooms;
				return;
			})
			.error(function(error) {
				console.log(error);
				return;
			});

		$scope.navigate = function(roomName) {
			$location.path('/rooms/'+roomName);
		}

		// $state.transitionTo('main.subviews');
	});
