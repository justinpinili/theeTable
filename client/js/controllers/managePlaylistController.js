angular.module('theeTable.controllers')
.controller('managePlaylistController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', '$http', 'loginSC', 'getSoundcloudID', 'getSCinstance', function($scope, $modalInstance, $modal, theeTableAuth, $http, loginSC, getSoundcloudID, getSCinstance) {

	$scope.playlist = [];

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

	$scope.sortableOptions = {
		stop: function(e, ui) {
			var playlist = [];
			for (var index = 0; index < $scope.playlist.length; index++) {
				playlist.push({ source: $scope.playlist[index].source, title: $scope.playlist[index].title, artist: $scope.playlist[index].artist, length: $scope.playlist[index].length, soundcloudID: $scope.playlist[index].soundcloudID });
			}
			$scope.$parent.newPlaylist = playlist;
		}
	};

	$scope.remove = function(index) {
		$scope.playlist.splice(index, 1);
		var playlist = [];
		for (var index = 0; index < $scope.playlist.length; index++) {
			playlist.push({ source: $scope.playlist[index].source, title: $scope.playlist[index].title, artist: $scope.playlist[index].artist, length: $scope.playlist[index].length, soundcloudID: $scope.playlist[index].soundcloudID });
		}
		$scope.$parent.newPlaylist = playlist;
	}

	$scope.convertTime = function(duration) {
		var hours = Math.floor(duration / 3600000);
		var minutes = Math.floor((duration % 3600000) / 60000);
		var seconds = Math.floor(((duration % 360000) % 60000) / 1000);

		if (seconds < 10) {
			seconds = "0"+seconds;
		}

		if (minutes < 10) {
			minutes = "0"+minutes;
		}

		if (hours > 0) {
			return hours + ":" + minutes + ":" + seconds;
		}

		return minutes + ":" + seconds;
	};

	$scope.connectSC = function() {

		var getPlaylists = function() {

				$scope.possiblePlaylists = 'start';

				var playlists = '/users/' + getSoundcloudID().id + '/playlists';

				getSCinstance().get(playlists, function(playlistResults) {

					getSCinstance().get('/users/' + getSoundcloudID().id + '/favorites', function(favoriteResults) {

						$scope.likes = favoriteResults;

						$scope.$apply(function() {
							$scope.possiblePlaylists = playlistResults;
						});

					});

					return;
				});

		};

		if (getSoundcloudID() === undefined) {
			loginSC(function() {
				$scope.$apply(function() {
					getPlaylists();
				});
			});
		} else {
			getPlaylists();
		}

	};

	$scope.importPlaylist = function(playlist, likes) {
		var importedPlaylist = [];

		if (likes === 'likes') {
			for (var index = 0; index < $scope.likes.length; index++) {
				importedPlaylist.push({ source: $scope.likes[index].permalink_url, title: $scope.likes[index].title, artist: $scope.likes[index].user.username, length: $scope.likes[index].duration, soundcloudID: $scope.likes[index].id });
			}
		} else {
			for (var index = 0; index < playlist.tracks.length; index++) {
				importedPlaylist.push({ source: playlist.tracks[index].permalink_url, title: playlist.tracks[index].title, artist: playlist.tracks[index].user.username, length: playlist.tracks[index].duration, soundcloudID: playlist.tracks[index].id });
			}
		}

		$scope.$parent.newPlaylist = importedPlaylist;
		$scope.playlist = importedPlaylist;
		delete $scope.possiblePlaylists;
	}

	theeTableAuth.getUserInfo(function(user) {
		$scope.playlist = user.playlist;
	});

}]);
