angular.module('theeTable.controllers')
	.controller('authController', ['$scope', '$location', 'localStorageService', 'theeTableAuth', 'theeTableUrl', function($scope, $location, localStorageService, theeTableAuth, theeTableUrl) {

		/**********************************
		 * main login to access theeTable *
		 *  - users can sign up / log in  *
		 *  - log in with soundcloud      *
		 **********************************/

		$scope.current = 'login';
		$scope.url = theeTableUrl.getUrl() + '/user/login';
		$scope.prompt = {};
		$scope.prompt.username = 'Enter your username.';
		$scope.prompt.password = 'Enter your password.';
		$scope.$parent.userInRoom = false;

		if (theeTableAuth.verifyJwt(true)) {
			$location.path('/rooms');
		}


		// Displays proper prompts for either a new user or an existing user trying to log in
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
		};

		// Authorize with user typed information
		$scope.auth = function(inputUsername, inputPassword) {
			theeTableAuth.siteAccess($scope.url, inputUsername, inputPassword, function(result) {
				if (!result.message) {

					localStorageService.set("jwt", result.jwt);

					$scope.$parent.getUserInfo(function() {

						// let socket.io know the user's name
						$scope.$parent.socket.emit("userName", {username: $scope.$parent.currentUser.username});

						// transfer to rooms lobby
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

		// Authorize using soundcloud
		$scope.authSC = function() {

			var theeTableDB = function(endpoint, isNew) {

				// Attempt to login to theeTable with soundcloud credentials
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
						// If the user does not exist, sign the user up with soundcloud credentials
						theeTableDB('/user/new', true);
					}

					$scope.message = result.message;
					$scope.login.password = '';
					return;
				});
			};

			$scope.$parent.loginSC(function() {
				// Once the user is verified with soundcloud, pass that information to the DB
				theeTableDB('/user/login', false)
			});

		};

		// prevents users from entering empty form inputs
		$scope.login = {};
		$scope.authDisabled = function() {
			if ($scope.login.username === undefined ||
			    $scope.login.password === undefined ||
					$scope.login.username === '' ||
					$scope.login.password === '') {
						return true;
					}
			return false;
		};

	}]);
