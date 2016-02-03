angular
	.module('theeTable.home.controller', [])
	.controller('homeController', homeController);

homeController.$inject = ['localStorageService', 'theeTableSoundcloud', 'theeTableAuth', 'theeTableUrl']

function homeController() {

	$scope.auth = auth;

	function auth(alreadyInRoom) {

		if (localStorageService.get("jwt") === null) {

			var scInit = SC.initialize({
				client_id: theeTableUrl.getID(),
				redirect_uri: '' + theeTableUrl.getUrl() + '/success'
			});

			$scope.sc = theeTableSoundcloud.setSCinstance(scInit);

			theeTableSoundcloud.loginSC(function() {

				$scope.getUserInfo(function(retrievedUser) {
					$scope.socket.emit("userName", {username: retrievedUser.username});
					$location.path("/rooms");
					return;
				});

			});

		} else {

			theeTableAuth.getUserInfo(function(user) {

				var scInit = SC.initialize({
					client_id: theeTableUrl.getID(),
					access_token: user.accessToken,
					redirect_uri: '' + theeTableUrl.getUrl() + '/success'
				});

				$scope.sc = theeTableSoundcloud.setSCinstance(scInit, user.username, user.scID);

				if (!$scope.sc.isConnected()) {

					theeTableSoundcloud.loginSC(function() {
						$scope.getUserInfo(function(retrievedUser) {
							$scope.socket.emit("userName", {username: retrievedUser.username});
							if (!alreadyInRoom) {
								$location.path("/rooms");
							}
							return;
						});
					});
					return;
				}

				theeTableSoundcloud.setSoundcloudID(user.scID, user.username);

				if (!alreadyInRoom) {
					$location.path("/rooms");
				}
				return;

			});

		}
	}
}
