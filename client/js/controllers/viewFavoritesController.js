angular.module('theeTable.controllers')
.controller('viewFavoritesController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', 'currentSocket', function($scope, $modalInstance, $modal, theeTableAuth, currentSocket) {

	$scope.favorites = [];

	$scope.sortableOptions = {
		stop: function(e, ui) {
			var favorites = [];
			for (var index = 0; index < $scope.favorites.length; index++) {
				favorites.push({ source: $scope.favorites[index].source, title: $scope.favorites[index].title, artist: $scope.favorites[index].artist, length: $scope.favorites[index].length, soundcloudID: $scope.favorites[index].soundcloudID });
			}
			// $scope.$parent.newFavorites = favorites;
			currentSocket.emit('newFavorites', { favorites: favorites });
		}
	};

	$scope.remove = function(index) {
		$scope.favorites.splice(index, 1);
		var favorites = [];
		for (var index = 0; index < $scope.favorites.length; index++) {
			favorites.push({ source: $scope.favorites[index].source, title: $scope.favorites[index].title, artist: $scope.favorites[index].artist, length: $scope.favorites[index].length, soundcloudID: $scope.favorites[index].soundcloudID });
		}
		// $scope.$parent.newFavorites = favorites;
		currentSocket.emit('newFavorites', { favorites: favorites });
	}

	$scope.addToPlaylist = function(song) {
		song = { source: song.source, title: song.title, artist: song.artist, length: song.length, soundcloudID: song.soundcloudID };
		currentSocket.emit('newPlaylistItem', { song: song });
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

	theeTableAuth.getUserInfo(function(user) {
		$scope.favorites = user.favorites;
	});

}]);
