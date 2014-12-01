angular.module('theeTable.controllers')
	.controller('signUpController', function($scope, $http) {
		$scope.signup = function(inputUsername, inputPassword) {
			$http.post('http://localhost:1337/user/new', {username: inputUsername, password: inputPassword})
				.success(function(result) {
					console.log(result);
				});
		}
	});
