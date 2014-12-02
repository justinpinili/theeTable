angular.module('theeTable.controllers')
	.controller('roomsController', function($scope, $state, $http) {

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

		// $state.transitionTo('main.subviews');
	});
