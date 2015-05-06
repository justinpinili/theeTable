// angular.module('theeTable.controllers')
// .controller('viewFavoritesController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', 'currentSocket', 'theeTableTime', function($scope, $modalInstance, $modal, theeTableAuth, currentSocket, theeTableTime) {
//
// 	/************************************************************
// 	 * viewFavoritesController allows the user to see what      *
// 	 * songs are on the their favorite's list.						    	*
// 	 * 																													*
// 	 * users can navigate remove the song and add a favorite to *
// 	 * their playlist.                                          *
// 	 ************************************************************/
//
// 	// modal initialization logic
//
// 	$scope.favorites = [];
//
// 	theeTableAuth.getUserInfo(function(user) {
// 		$scope.favorites = user.favorites;
// 	});
//
// 	// re-order the songs on the favorites list
// 	$scope.sortableOptions = {
// 		stop: function(e, ui) {
// 			var favorites = [];
// 			for (var index = 0; index < $scope.favorites.length; index++) {
// 				favorites.push({ source: $scope.favorites[index].source, title: $scope.favorites[index].title, artist: $scope.favorites[index].artist, length: $scope.favorites[index].length, soundcloudID: $scope.favorites[index].soundcloudID });
// 			}
// 			currentSocket.emit('newFavorites', { favorites: favorites });
// 		}
// 	};
//
// 	// remove a song from the favorites list
// 	$scope.remove = function(index) {
// 		$.snackbar({content: "<span class='glyphicon glyphicon-trash big-icon'></span> " + $scope.favorites[index].title + " has been removed to your liked songs" });
// 		$scope.favorites.splice(index, 1);
// 		var favorites = [];
// 		for (var index = 0; index < $scope.favorites.length; index++) {
// 			favorites.push({ source: $scope.favorites[index].source, title: $scope.favorites[index].title, artist: $scope.favorites[index].artist, length: $scope.favorites[index].length, soundcloudID: $scope.favorites[index].soundcloudID });
// 		}
// 		currentSocket.emit('newFavorites', { favorites: favorites });
// 	}
//
// 	// adds a favorite to the user's playlist
// 	$scope.addToPlaylist = function(song) {
// 		song = { source: song.source, title: song.title, artist: song.artist, length: song.length, soundcloudID: song.soundcloudID };
// 		currentSocket.emit('newPlaylistItem', { song: song });
// 	}
//
// 	// converts the time into hours, minutes, seconds
// 	$scope.convertTime = function(duration) {
// 		return theeTableTime.convertTime(duration);
// 	};
//
// 	// close modal
// 	$scope.close = function() {
// 		$modalInstance.close();
// 	}
//
// }]);
