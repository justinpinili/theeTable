angular.module('theeTable.services')
	.factory('theeTableAuth', ['$http', 'localStorageService', '$location', function($http, localStorageService, $location) {
		var siteAccess = function(url, username, password, callback) {
			$http.post(url, {username: username, password: password})
				.success(function(result) {
					callback(result);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				})
		};

		var getUserInfo = function(callback) {
			var jwt = localStorageService.get("jwt");
			$http.get('http://localhost:1337/user?jwt_token='+jwt)
				.success(function(result) {
					callback(result);
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		};

		var verifyJwt = function() {
			var jwt = localStorageService.get("jwt");
			if (!jwt) {
				alert("you must be logged in to access Thee Table.");
				$location.path("/main");
				return false;
			} else {
				return true;
			}
		};

		return {
			siteAccess: siteAccess,
			getUserInfo: getUserInfo,
			verifyJwt: verifyJwt
		};
	}]);
