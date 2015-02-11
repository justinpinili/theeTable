angular.module('theeTable.controllers')
.controller('managePlaylistController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', 'loginSC', 'getSoundcloudID', 'getSCinstance','theeTableTime', 'theeTableSoundcloud', function($scope, $modalInstance, $modal, theeTableAuth, loginSC, getSoundcloudID, getSCinstance, theeTableTime, theeTableSoundcloud) {

	/***********************************************************
	 * managePlaylistController allows the user to see what is *
	 * currently on the their playlist.												 *
	 *  																											 *
	 * Allows for: 																						 *
	 *  - Searching on soundcloud for a track									 *
	 *  - Importing playlists/likes from soundcloud						 *
	 *  - Re-ordering, deleting, adding songs on the playlist. *
	 ***********************************************************/

	$scope.playlist = [];

	theeTableAuth.getUserInfo(function(user) {
		$scope.playlist = user.playlist;
	});

	// clear the scoped arrays of $$ properties
	var songsForDB = function(collection) {
		var songCollection = [];
		for (var index = 0; index < collection.length; index++) {
			songCollection.push({ source: collection[index].source || collection[index].permalink_url, title: collection[index].title,
				artist: collection[index].artist || collection[index].user.username,
				length: collection[index].length || collection[index].duration,
				soundcloudID: collection[index].soundcloudID || collection[index].id
			});
		}
		return songCollection;
	}

	// searching soundcloud lives in its own modal
	$scope.searchSC = function() {
		var modalInstance = $modal.open({
			templateUrl: './../templates/search.html',
			controller: 'searchController',
			size: 'lg',
			resolve: {
				playlist: function () {
					return $scope.playlist;
				},
				getSCinstance: function() {
					return getSCinstance;
				}
			}
		});
	}

	// allows for re-ordering playlist
	$scope.sortableOptions = {
		stop: function(e, ui) {
			$.snackbar({content: "Your playlist order has beeen updated." });
			$scope.$parent.newPlaylist = songsForDB($scope.playlist);
		}
	};

	// removes an entry from the playlist
	$scope.remove = function(index) {
		$.snackbar({content: "" + $scope.playlist[index].title + " has been removed from your playlist." });
		$scope.playlist.splice(index, 1);
		$scope.$parent.newPlaylist = songsForDB($scope.playlist);
	}

	// displays proper time info for each song on the playlist
	$scope.convertTime = function(duration) {
		return theeTableTime.convertTime(duration);
	};

	// if the user has a soundcloud account, connect to it and retrieve
	// playlists and likes so that the user can import those songs
	$scope.connectSC = function() {

		var getPlaylists = function() {

			$scope.possiblePlaylists = 'start';

			theeTableSoundcloud.getPlaylists(function(favoriteResults, playlistResults) {
				$scope.$apply(function() {
					$scope.likes = favoriteResults;
					$scope.possiblePlaylists = playlistResults;
				});
			});

		};

		if (getSoundcloudID().id === undefined) {
			loginSC(function() {
				$scope.$apply(function() {
					getPlaylists();
				});
			});
		} else {
			getPlaylists();
		}

	};

	// Sets the chosen playlist as the user's new playlist
	// currently over-rides all entries.
	$scope.importPlaylist = function(playlist, likes) {
		var importedPlaylist = [];

		if (likes === 'likes') {
			$scope.$parent.newPlaylist = songsForDB($scope.likes);
		} else {
			$scope.$parent.newPlaylist = songsForDB(playlist.tracks);
		}

		$scope.playlist = $scope.$parent.newPlaylist;
		delete $scope.possiblePlaylists;
	}

	// close modal
	$scope.close = function() {
		$modalInstance.close();
	}

}]);
