angular.module('theeTable.controllers')
.controller('managePlaylistController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', 'loginSC', 'getSoundcloudID', 'getSCinstance','theeTableTime', 'theeTableSoundcloud', 'currentDJ', 'username', '$sce', 'lower', 'inQueue', function($scope, $modalInstance, $modal, theeTableAuth, loginSC, getSoundcloudID, getSCinstance, theeTableTime, theeTableSoundcloud, currentDJ, username, $sce, lower, inQueue) {

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

	// clear the scoped arrays of un-needed properties
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
			templateUrl: './../templates/modals/search.html',
			controller: 'searchController',
			size: 'lg',
			resolve: {
				playlist: function () {
					return $scope.playlist;
				},
				getSCinstance: function() {
					return getSCinstance;
				},
				lower: function() {
					return lower;
				}
			}
		});

		modalInstance.result.then(function () {}, function () {
			lower(true);
		});
	}

	// allows for re-ordering playlist
	$scope.sortableOptions = {
		stop: function(e, ui) {
			$.snackbar({content: "<i class='mdi-editor-format-list-numbered big-icon'></i> Your playlist order has beeen updated." });

			// allow the user to change the position except for the current song playing. it will always stay on top.
			if (currentDJ === username) {
				if ($scope.oldPlaylist[0].title !== $scope.playlist[0].title) {

					var currentSongIndex;
					for (var index = 0; index < $scope.playlist.length; index++) {
						if ($scope.playlist[index].title === $scope.oldPlaylist[0].title) {
							currentSongIndex = index;
						}
					}
					var currentSong = $scope.playlist.splice(currentSongIndex, 1)[0];
					$scope.playlist.unshift(currentSong);
				}
			}
			$scope.$parent.newPlaylist = songsForDB($scope.playlist);
		},
		activate: function(e, ui) {
			$scope.oldPlaylist = angular.copy($scope.playlist);
		}
	};

	$scope.bump = function(index) {
		var bumpedSong = $scope.playlist.splice(index, 1)[0];
		if (currentDJ === username) {
			var currentSong = $scope.playlist.shift();
			$scope.playlist.unshift(bumpedSong);
			$scope.playlist.unshift(currentSong);
		} else {
			$scope.playlist.unshift(bumpedSong);
		}

		$scope.$parent.newPlaylist = songsForDB($scope.playlist);

		$.snackbar({content: "<span class='mdi-editor-publish big-icon'></span>" + bumpedSong.title + " has been moved to the top of your playlist."});
	}

	// removes an entry from the playlist
	$scope.remove = function(index) {
		if ($scope.playlist.length === 1 && inQueue) {
			$.snackbar({content: "<i class='mdi-notification-sms-failed big-icon'></i> Sorry, if you are playing music, you cannot remove your only song." });
			return;
		}

		$.snackbar({content: "<span class='glyphicon glyphicon-trash big-icon'></span> " + $scope.playlist[index].title + " has been removed from your playlist." });
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

			for (var likesIndex = 0; likesIndex < $scope.likes.length; likesIndex++) {

				var songExists = false;

				for (var playlistIndex = 0; playlistIndex < $scope.playlist.length; playlistIndex++) {
					if ($scope.likes[likesIndex].id === $scope.playlist[playlistIndex].soundcloudID) {
						songExists = true;
					}
				}

				if (!songExists) {
					importedPlaylist.push( $scope.likes[likesIndex] );
				}
			}

			$scope.$parent.newPlaylist = songsForDB($scope.playlist.concat(importedPlaylist));

			$.snackbar({ content: "<i class='mdi-av-playlist-add big-icon'></i>" + ' You have added ' + importedPlaylist.length + ' songs to your playlist.' });

		} else {
			$scope.$parent.newPlaylist = songsForDB(playlist.tracks);
		}

		$scope.playlist = $scope.$parent.newPlaylist;
		delete $scope.possiblePlaylists;
	}

	$scope.showPreview = false;
	$scope.previewSource = '';

	var sce = function(song) {
		return $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url='+song+'&auto_play=true');
	}

	var widget;

	$scope.preview = function(index) {
		lower();
		$scope.showPreview = true;
		$scope.previewSource = sce($scope.playlist[index].source);
		$scope.previewIndex = index;

		setTimeout(function() {
			var widgetID = 'sc-widget'+index;

			var widgetIframe = document.getElementById(widgetID);

			if (widget !== undefined) {
				widget.unbind(SC.Widget.Events.READY);
			}

			widget = SC.Widget(widgetIframe);

			widget.bind(SC.Widget.Events.READY, function() {
				widget.play();
			});

		}, 500);
	}

	// close modal
	$scope.close = function() {
		$modalInstance.close();
	}

}]);
