angular.module('theeTable.controllers')
.controller('searchController', ['$scope', '$modalInstance', '$modal', 'playlist', function($scope, $modalInstance, $modal, playlist) {

	$scope.soundcloud = {};

	$scope.search = function(query) {

		$scope.soundcloud.results = [];
		$scope.searching = true;

		SC.initialize({
			client_id: '3fad6addc9d20754f8457461d02465f2'
		});

		// console.log($scope.soundcloud.query);
		// console.log(query);

		query = $('#soundcloudSearch').val();

		SC.get('/tracks', { q: query }, function(tracks) {
			console.log(tracks);

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

	$scope.updatePlaylist = function(url, title, artist, length) {
		console.log(artist);
		console.log(length);
		$scope.$parent.newURL = { source: url, title: title, artist: artist, length: length };
		playlist.push({ source: url, title: title, artist: artist, length: length });
		$modalInstance.close();
	};

}]);
