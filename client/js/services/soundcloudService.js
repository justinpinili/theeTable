angular.module('theeTable.services')
.factory('theeTableSoundcloud', [function() {

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

	var getSCinstance = function() {
		return SC;
	};

	// log into soundcloud
	var loginSC = function(callback) {

		// initiate auth popup
		SC.connect(function() {

			// logic in here after connection and pop up closes
			SC.get('/me', function(me) {
				soundcloudID.id = me.id;
				soundcloudID.username = me.permalink;
				if (callback) {
					callback();
				}
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
		setSCinstance: setSCinstance,
		getSCinstance: getSCinstance,
		like: like,
		searchTracks: searchTracks,
		getPlaylists: getPlaylists,
		loginSC: loginSC
	};
}]);
