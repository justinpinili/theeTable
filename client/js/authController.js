angular.module('theeTable.controllers')
	.controller('authController', function($scope, $state, $http) {
		$scope.login = function(inputUsername, inputPassword) {
			// $http.post('http://localhost:1337/user/login', {username: inputUsername, password: inputPassword})
			// 	.success(function(result) {
			// 		if (!result.message) {
			// 			console.log(result);
			// 			// transfer to rooms lobby
			// 			return;
			// 		}
			// 		// update form validations
			// 		console.log(result.message);
			// 		return;
			// 	});
		};

		$scope.signup = function(inputUsername, inputPassword) {
			$http.post('http://localhost:1337/user/new', {username: inputUsername, password: inputPassword})
				// .success(function(result) {
				// 	if (!result.message) {
				// 		console.log(result);
				// 		// transfer to rooms lobby
				// 		return;
				// 	}
				// 	// update form validations
				// 	console.log(result.message);
				// 	return;
				// });
		};
	});
