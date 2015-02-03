angular.module('theeTable.controllers')
	.controller('authController', ['$scope', '$location', 'localStorageService', 'theeTableAuth', function($scope, $location, localStorageService, theeTableAuth) {

		$scope.current = 'Log In';
		$scope.url = 'http://localhost:1337/user/login';

		$scope.switchForm = function() {
			if ($scope.current === 'Log In') {
				$scope.current = 'Sign Up';
				$scope.url = 'http://localhost:1337/user/new';
			} else {
				$scope.current = 'Log In';
				$scope.url = 'http://localhost:1337/user/login';
			}
			return;
		}

		$scope.auth = function(inputUsername, inputPassword) {
			theeTableAuth.siteAccess($scope.url, inputUsername, inputPassword, function(result) {
				if (!result.message) {
					// console.log(result);
					// transfer to rooms lobby
					localStorageService.set("jwt", result.jwt);
					$scope.$parent.getUserInfo();
					$location.path("/rooms");
					return;
				}
				$scope.message = result.message;
				$scope.login.password = '';
				// console.log(result.message);
				return;
			});
		};

		$scope.authSC = function() {
			$scope.$parent.loginSC(function() {
				theeTableAuth.siteAccess('http://localhost:1337/user/login', $scope.$parent.soundcloudID.username, 'abc', function(result) {
					if (!result.message) {
						localStorageService.set("jwt", result.jwt);
						$scope.$parent.getUserInfo();
						$location.path("/rooms");
						return;
					}

					theeTableAuth.siteAccess('http://localhost:1337/user/new', $scope.$parent.soundcloudID.username, 'abc', function(result) {
						if (!result.message) {
							localStorageService.set("jwt", result.jwt);
							$scope.$parent.getUserInfo();
							$location.path("/rooms");
							return;
						}

						$scope.message = result.message;
						$scope.login.password = '';
						// console.log(result.message);
						return;
					});

				});

			});
		}

		$scope.login = {};

		$scope.authDisabled = function() {
			if ($scope.login.username === undefined ||
			    $scope.login.password === undefined ||
					$scope.login.username === '' ||
					$scope.login.password === '') {
						return true;
					}
			return false;
		}

	}]);
