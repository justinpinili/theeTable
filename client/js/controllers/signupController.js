angular.module('theeTable.controllers')
.controller('signupController', ['$scope', '$location', 'localStorageService', 'theeTableAuth', 'theeTableUrl', 'userInRoom', '$modalInstance', 'getUserInfo', 'currentSocket', 'loginSC', 'roomName', function($scope, $location, localStorageService, theeTableAuth, theeTableUrl, userInRoom, $modalInstance, getUserInfo, currentSocket, loginSC, roomName) {

	/**********************************
	* main login to access theeTable *
	*  - users can sign up / log in  *
	*  - log in with soundcloud      *
	**********************************/

	$scope.current = 'new';
	$scope.url = theeTableUrl.getUrl() + '/user/new';
	$scope.prompt = {};
	$scope.prompt.username = 'Choose a new username.';
	$scope.prompt.password = 'Choose a new password.';

	userInRoom = false;

	$scope.signupController = true;

	// Authorize with user typed information
	$scope.auth = function(inputUsername, inputPassword) {
		theeTableAuth.siteAccess($scope.url, inputUsername, inputPassword, function(result) {
			if (!result.message) {

				localStorageService.set("jwt", result.jwt);

				getUserInfo(function(retrievedUser) {

					// let socket.io know the user's name
					currentSocket.emit("userName", {username: retrievedUser.username});

					$scope.$parent.showApp = true;
					$modalInstance.close();

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

		var theeTableDB = function(endpoint, isNew, username) {

			// Attempt to login to theeTable with soundcloud credentials
			theeTableAuth.siteAccess(""+ theeTableUrl.getUrl() + endpoint, username, 'abc', function(result) {
				if (!result.message) {
					localStorageService.set("jwt", result.jwt);
					getUserInfo(function(retrievedUser) {
						currentSocket.emit("userName", {username: retrievedUser.username});

						$scope.$parent.showApp = true;
						$modalInstance.close();

						$location.path("/rooms");
						return;
					});
					return;
				}

				if (isNew) {
					// If the user does not exist, sign the user up with soundcloud credentials
					theeTableDB('/user/new', false, username);
					return;
				}

				$scope.message = result.message;
				$scope.login.password = '';
				return;
			});
		};

		loginSC(function(soundcloudID) {
			// Once the user is verified with soundcloud, pass that information to the DB
			theeTableDB('/user/login', true, soundcloudID.username);
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
