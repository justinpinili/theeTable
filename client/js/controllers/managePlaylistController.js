angular.module('theeTable.controllers')
.controller('managePlaylistController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', 'loginSC', 'getSoundcloudID', 'getSCinstance','theeTableTime', 'theeTableSoundcloud', function($scope, $modalInstance, $modal, theeTableAuth, loginSC, getSoundcloudID, getSCinstance, theeTableTime, theeTableSoundcloud) {

	$scope.playlist = [];

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
			$scope.$parent.newPlaylist = songsForDB($scope.playlist);
		}
	};

	$scope.remove = function(index) {
		$scope.playlist.splice(index, 1);
		$scope.$parent.newPlaylist = songsForDB($scope.playlist);
	}

	$scope.convertTime = function(duration) {
		return theeTableTime.convertTime(duration);
	};

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

	theeTableAuth.getUserInfo(function(user) {
		$scope.playlist = user.playlist;
	});

}]);
