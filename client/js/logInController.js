angular.module('theeTable.controllers')
	.controller('logInController', function($scope, $state, $http) {
		$scope.login = function(inputUsername, inputPassword) {
			$http.post('http://localhost:1337/user/login', {username: inputUsername, password: inputPassword})
				.success(function(result) {
					console.log(result);
				});
		}
	});
