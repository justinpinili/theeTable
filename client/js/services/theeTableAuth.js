angular.module('theeTable.services')
	.factory('theeTableAuth', ['$http', 'localStorageService', '$location', 'theeTableUrl', function($http, localStorageService, $location, theeTableUrl) {

		/************************************************************
		 * theeTableAuth retrieves information from the DB for a    *
		 * user.                                                  	*
		 *                                                          *
		 * Login / Sign Up                                          *
		 * Obtain user information                                  *
		 * verify JWT                                               *
		 ************************************************************/

		// Login or Signup
		var siteAccess = function(url, username, password, accessToken, scID, callback) {
			$http.post(url, { username: username, password: password, accessToken: accessToken, scID: scID })
				.success(function(result) {
					callback(result);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		};

		// Obtain user information
		var getUserInfo = function(callback) {
			var jwt = localStorageService.get("jwt");
			$http.get("" + theeTableUrl.getUrl() + '/user?jwt_token='+jwt)
				.success(function(result) {
					callback(result);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		};

		// Verify JWT
		var verifyJwt = function(redirect) {
			var jwt = localStorageService.get("jwt");
			if (!jwt) {
				if (!redirect) {
					alert("you must be logged in to access Thee Table.");
					$location.path("/main");
				}
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
