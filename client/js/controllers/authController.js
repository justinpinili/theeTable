angular.module('theeTable.controllers')
	.controller('authController', ['$scope', '$location', 'localStorageService', 'theeTableAuth', 'theeTableUrl', function($scope, $location, localStorageService, theeTableAuth, theeTableUrl) {

		$scope.current = 'login';
		$scope.url = theeTableUrl.getUrl() + '/user/login';
		$scope.prompt = {};
		$scope.prompt.username = 'Enter your username.';
		$scope.prompt.password = 'Enter your password.';

		$scope.switchForm = function() {
			if ($scope.current === 'login') {
				$scope.current = 'new';
				$scope.prompt.username = 'Choose a new username.';
				$scope.prompt.password = 'Choose a new password.';
			} else {
				$scope.current = 'login';
				$scope.prompt.username = 'Enter your username.';
				$scope.prompt.password = 'Enter your password.';
			}
			$scope.url = ""+ theeTableUrl.getUrl() + '/user/' + $scope.current;
			return;
		}

		$scope.auth = function(inputUsername, inputPassword) {
			theeTableAuth.siteAccess($scope.url, inputUsername, inputPassword, function(result) {
				if (!result.message) {
					// console.log(result);
					// transfer to rooms lobby
					localStorageService.set("jwt", result.jwt);
					$scope.$parent.getUserInfo(function() {
						$scope.$parent.socket.emit("userName", {username: $scope.$parent.currentUser.username});
						$location.path("/rooms");
						return;
					});
					return;
				}
				$scope.message = result.message;
				$scope.login.password = '';
				return;
			});
		};

		$scope.authSC = function() {

			var theeTableDB = function(endpoint, isNew) {
				theeTableAuth.siteAccess(""+ theeTableUrl.getUrl() + endpoint, $scope.$parent.soundcloudID.username, 'abc', function(result) {
					if (!result.message) {
						localStorageService.set("jwt", result.jwt);
						$scope.$parent.getUserInfo(function() {
							$scope.$parent.socket.emit("userName", {username: $scope.$parent.currentUser.username});
							$location.path("/rooms");
							return;
						});
						return;
					}
					if (isNew) {
						theeTableDB('/user/new', true);
					}

					$scope.message = result.message;
					$scope.login.password = '';
					// console.log(result.message);
					return;
				});
			};

			$scope.$parent.loginSC(function() {
				theeTableDB('/user/login', false)
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
