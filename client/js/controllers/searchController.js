angular.module('theeTable.controllers')
.controller('searchController', ['$scope', '$modalInstance', '$modal', 'playlist', 'getSCinstance', 'theeTableSoundcloud', function($scope, $modalInstance, $modal, playlist, getSCinstance, theeTableSoundcloud) {

	$scope.soundcloud = {};

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

	};

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

	$scope.addSongToPlaylist = function(url, title, artist, length, id, index) {
		$scope.soundcloud.results.splice(index,1);
		$scope.$parent.newSong = { source: url, title: title, artist: artist, length: length, soundcloudID: id };
		playlist.push({ source: url, title: title, artist: artist, length: length, soundcloudID: id });

		// $modalInstance.close();
	};

}]);
