angular.module('theeTable.controllers')
	.controller('authController', function($scope, $location, $http) {

		$scope.auth = function(inputUsername, inputPassword) {
			$http.post($scope.$parent.url, {username: inputUsername, password: inputPassword})
				.success(function(result) {
					if (!result.message) {
						console.log(result);
						// transfer to rooms lobby
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
