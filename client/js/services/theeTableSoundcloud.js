angular.module('theeTable.services')
.factory('theeTableSoundcloud', ['theeTableAuth', 'theeTableUrl', 'localStorageService', function(theeTableAuth, theeTableUrl, localStorageService) {

	/*************************************************************
	 * theeTableSoundcloud factory creates the soundcloud client *
	 * and facilitates the interation with the soundcloud api  	 *
	 *                                                           *
	 * Retrieve ID                                               *
	 * Retrieve soundcloud client instance                       *
	 * log into soundcloud                                       *
	 * like songs on soundcloud                                  *
	 * search on soundcloud                                      *
	 * import playlists/likes on soundcloud                      *
	 *************************************************************/

	var SC;
	var soundcloudID = {};

	var getSoundcloudID = function() {
		return soundcloudID;
	};

	var setSCinstance = function(scInit) {
		SC = scInit;
		return SC;
	};

	var setSoundcloudID = function(id, username) {
		soundcloudID.id = id;
		soundcloudID.username = username;
	}

	var getSCinstance = function() {
		return SC;
	};

	var theeTableDB = function(endpoint, isNew, username, accessToken, scID, callback) {
		// Attempt to login to theeTable with soundcloud credentials
		theeTableAuth.siteAccess(""+ theeTableUrl.getUrl() + endpoint, username, 'abc', accessToken, scID, function(result) {
			if (!result.message) {
				localStorageService.set("jwt", result.jwt);
				callback();
				return;
			}

			if (isNew) {
				// If the user does not exist, sign the user up with soundcloud credentials
				theeTableDB('/user/new', false, username, accessToken, scID, callback);
				return;
			}

			$scope.message = result.message;
			// NEEDS TO BE UPDATED
			return;
		});
	};

	// log into soundcloud
	var loginSC = function(callback) {
		SC.connect(function() {
			// logic in here after connection and pop up closes
			SC.get('/me', function(me) {
				soundcloudID.id = me.id;
				soundcloudID.username = me.username;
				theeTableDB('/user/login', true, me.username, SC.accessToken(), me.id, callback);
			});
		});
	};

	// like on soundcloud
	var like = function(id) {
		SC.put('/me/favorites/'+id);
	};

	// search soundcloud
	var searchTracks = function(query, callback) {
		SC.get('/tracks', {q: query }, function(tracks) {
			callback(tracks);
		});
	};

	// obtain playlist and likes from soundcloud
	var getPlaylists = function(callback) {

		var playlists = '/users/' + soundcloudID.id + '/playlists';

		SC.get(playlists, function(playlistResults) {

			SC.get('/users/' + soundcloudID.id + '/favorites', function(favoriteResults) {
				callback(favoriteResults, playlistResults);
			});

			return;
		});

	};

	return {
		getSoundcloudID: getSoundcloudID,
		setSoundcloudID: setSoundcloudID,
		setSCinstance: setSCinstance,
		getSCinstance: getSCinstance,
		like: like,
		searchTracks: searchTracks,
		getPlaylists: getPlaylists,
		loginSC: loginSC
	};
}]);
