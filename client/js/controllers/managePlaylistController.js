angular.module('theeTable.controllers')
.controller('managePlaylistController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', '$http', function($scope, $modalInstance, $modal, theeTableAuth, $http) {

	$scope.playlist = [];

	$scope.searchSC = function() {
		var modalInstance = $modal.open({
			templateUrl: './../templates/search.html',
			controller: 'searchController',
			size: 'lg',
			resolve: {
				playlist: function () {
					return $scope.playlist;
				}
			}
		});
	}

	$scope.sortableOptions = {
		stop: function(e, ui) {
			var playlist = [];
			for (var index = 0; index < $scope.playlist.length; index++) {
				playlist.push({ source: $scope.playlist[index].source, title: $scope.playlist[index].title, artist: $scope.playlist[index].artist, length: $scope.playlist[index].length });
			}
			$scope.$parent.newPlaylist = playlist;
		}
	};

	$scope.remove = function(index) {
		$scope.playlist.splice(index, 1);
		var playlist = [];
		for (var index = 0; index < $scope.playlist.length; index++) {
			playlist.push({ source: $scope.playlist[index].source, title: $scope.playlist[index].title, artist: $scope.playlist[index].artist, length: $scope.playlist[index].length });
		}
		$scope.$parent.newPlaylist = playlist;
	}

	$scope.convertTime = function(duration) {
		var hours = Math.floor(duration / 3600000);
		var minutes = Math.floor((duration % 3600000) / 60000);
		var seconds = Math.floor(((duration % 360000) % 60000) / 1000);

		if (hours > 0) {
			return hours + ":" + minutes + ":" + seconds;
		}

		if (seconds < 10) {
			seconds = "0"+seconds;
		}
		return minutes + ":" + seconds;
	};

	$scope.connectSC = function() {
		// initialize client with app credentials
		SC.initialize({
			client_id: '3fad6addc9d20754f8457461d02465f2',
			redirect_uri: 'http://localhost:1337/success'
		});

		// initiate auth popup
		SC.connect(function() {
			SC.get('/me', function(me) {
				// alert('Hello, ' + me.username);
				console.log("me", me);

				$scope.$apply(function() {
					$scope.possiblePlaylists = 'start';
				});

				var playlists = '/users/' + me.id + '/playlists';

				SC.get(playlists, function(playlistResults) {
					console.log("playlists", playlistResults);

					SC.get('/users/' + me.id + '/favorites', function(favoriteResults) {
						console.log("likes", favoriteResults);
						$scope.likes = favoriteResults;

						$scope.$apply(function() {
							$scope.possiblePlaylists = playlistResults;
						});

					});


					return;
				});
			});
		});
	};

	$scope.importPlaylist = function(playlist, likes) {
		var importedPlaylist = [];

		if (likes === 'likes') {
			console.log("hit");
			for (var index = 0; index < $scope.likes.length; index++) {
				importedPlaylist.push({ source: $scope.likes[index].permalink_url, title: $scope.likes[index].title, artist: $scope.likes[index].user.username, length: $scope.likes[index].duration });
			}
		} else {
			for (var index = 0; index < playlist.tracks.length; index++) {
				importedPlaylist.push({ source: playlist.tracks[index].permalink_url, title: playlist.tracks[index].title, artist: playlist.tracks[index].user.username, length: playlist.tracks[index].duration });
			}
		}

		$scope.$parent.newPlaylist = importedPlaylist;
		$scope.playlist = importedPlaylist;
	}

	theeTableAuth.getUserInfo(function(user) {
		$scope.playlist = user.playlist;
	});

}]);
