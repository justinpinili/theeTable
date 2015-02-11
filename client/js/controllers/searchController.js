angular.module('theeTable.controllers')
.controller('searchController', ['$scope', '$modalInstance', '$modal', 'playlist', 'getSCinstance', 'theeTableSoundcloud', 'theeTableTime', function($scope, $modalInstance, $modal, playlist, getSCinstance, theeTableSoundcloud, theeTableTime) {

	/************************************************************
	 * searchController allows the user to search on soundcloud *
	 * and can add results to their playlist   					        *
	 ************************************************************/

	$scope.soundcloud = {};

	// search soundcloud
	$scope.search = function(query) {

		$scope.soundcloud.results = [];
		$scope.searching = true;

		query = $('#soundcloudSearch').val();

		theeTableSoundcloud.searchTracks(query, function(tracks) {
			$scope.searching = false;

			$scope.$apply(function() {
				$scope.soundcloud.results = tracks;
			});
		});

		$scope.soundcloud.query = '';
		$('#soundcloudSearch').val('');

		return;
	};

	// display proper time
	$scope.convertTime = function(duration) {
		return theeTableTime.convertTime(duration);
	};

	// adds chosen song to the playlist
	// also remove's the from the search results
	$scope.addSongToPlaylist = function(url, title, artist, length, id, index) {
		$scope.soundcloud.results.splice(index,1);
		$scope.$parent.newSong = { source: url, title: title, artist: artist, length: length, soundcloudID: id };
		playlist.push({ source: url, title: title, artist: artist, length: length, soundcloudID: id });
		return;
	};

	// close modal
	$scope.close = function() {
		$modalInstance.close();
	}

}]);
