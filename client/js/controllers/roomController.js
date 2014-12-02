angular.module('theeTable.controllers')
	.controller('roomController', function($scope, $state, $http, $stateParams) {

		$scope.room = [];

		$http.get('http://localhost:1337/rooms/'+$stateParams.roomName)
			.success(function(result) {
				if (!result.message) {
					console.log(result);
					$scope.room = result;
					return;
				}
				// $scope.message = result.message;
				console.log(result.message);
				return;
			})
			.error(function(error) {
				console.log(error);
				return;
			});

		// $state.transitionTo('main.subviews');
	});
