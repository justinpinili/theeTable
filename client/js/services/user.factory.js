angular
	.module('theeTable.services.user', [])
	.factory('CurrentUserService', CurrentUserService);

CurrentUserService.$inject = ['localStorageService', 'theeTableUrl', 'theeTableSoundcloud', 'theeTableAuth', '$q'];

function CurrentUserService(localStorageService, '$q') {

	var currentUser;
	var svc = {};

	svc.getUser = getUser;

	return svc;

	function getUser() {

		if (localStorageService.get('jwt') === null) {

			var scInit = SC.initialize({
				client_id: theeTableUrl.getID(),
				redirect_uri: '' + theeTableUrl.getUrl() + '/success'
			});

			theeTableSoundcloud.setSCinstance(scInit);

			theeTableSoundcloud.loginSC(function() {

				theeTableAuth.getUserInfo(function(retrievedUser) {
	        if (!retrievedUser.message) {
	          currentUser = retrievedUser;
						$scope.socket.emit("userName", {username: retrievedUser.username});
						$location.path("/rooms");
	        }
	      });
		}

	}
}
