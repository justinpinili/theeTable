angular.module('theeTable.controllers')
	.controller('authController', function($scope, $location, $http,localStorageService) {

		$scope.current = 'login';
		$scope.url = 'http://localhost:1337/user/login';

		$scope.switchForm = function() {
			if ($scope.current === 'login') {
				$scope.current = 'signup';
				$scope.url = 'http://localhost:1337/user/new';
			} else {
				$scope.current = 'login';
				$scope.url = 'http://localhost:1337/user/login';
			}
			return;
		}

		$scope.auth = function(inputUsername, inputPassword) {
			$http.post($scope.url, {username: inputUsername, password: inputPassword})
				.success(function(result) {
					if (!result.message) {
						console.log(result);
						// transfer to rooms lobby
						localStorageService.set("jwt", result.jwt);
						$location.path("/rooms");
						return;
					}
					$scope.message = result.message;
					// console.log(result.message);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		};

		$scope.authDisabled = function() {
			if ($scope.username === undefined ||
			    $scope.password === undefined ||
					$scope.username === '' ||
					$scope.password === '') {
						return true;
					}
			return false;
		}

	});
