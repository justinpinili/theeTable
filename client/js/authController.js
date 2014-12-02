angular.module('theeTable.controllers')
	.controller('authController', function($scope, $state, $http) {

		$scope.auth = function(inputUsername, inputPassword) {
			$http.post($scope.$parent.url, {username: inputUsername, password: inputPassword})
				.success(function(result) {
					if (!result.message) {
						console.log(result);
						// transfer to rooms lobby
						return;
					}
					$scope.message = result.message;
					// console.log(result.message);
					return;
				});
		};

		$scope.signup = function(inputUsername, inputPassword) {
			$http.post('http://localhost:1337/user/new', {username: inputUsername, password: inputPassword})
				.success(function(result) {
					if (!result.message) {
						console.log(result);
						// transfer to rooms lobby
						return;
					}
					// update form validations
					console.log(result.message);
					return;
				});
		};

		$scope.authDisabled = function() {
			if ($scope.logInForm.logInUsername.$error.required === undefined &&
				    $scope.logInForm.logInPassword.$error.required === undefined) {
							$scope.usernameFeedback = {error: false, class: 'has-success'};
							$scope.passwordFeedback = {error: false, class: 'has-success'};
							$scope.buttonFeedback = "btn-success";
							return false;
						}
		  return true;
		};

		$scope.usernameFeedback = {error: null, class: ' '};
		$scope.passwordFeedback = {error: null, class: ' '};
		$scope.buttonFeedback = "btn-default";

		$scope.dirtyAndInvalid = function(dirty, invalid, input) {
			if (dirty === true && invalid === true) {
				if (input === 'username') {
					$scope.usernameFeedback.error = true;
					$scope.usernameFeedback.class = "has-error";
				}
				if (input === 'password') {
					$scope.passwordFeedback.error = true;
					$scope.passwordFeedback.class = "has-error";
				}
				$scope.buttonFeedback = "btn-default";
				return true;
			}
			return false;
		};

	});
