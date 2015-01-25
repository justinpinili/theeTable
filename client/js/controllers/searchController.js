angular.module('theeTable.controllers')
.controller('searchController', ['$scope', '$modalInstance', '$modal', 'playlist', function($scope, $modalInstance, $modal, playlist) {

	$scope.soundcloud = {};

	$scope.search = function(query) {
		SC.initialize({
			client_id: '3fad6addc9d20754f8457461d02465f2'
		});

		SC.get('/tracks', { q: query }, function(tracks) {
			// console.log(tracks);
			$scope.$apply(function() {
				$scope.soundcloud.results = tracks;
			});
		});

		$scope.soundcloud.query = '';

	};

	$scope.updatePlaylist = function(url, title) {
		$scope.$parent.newURL = { source: url, title: title };
		playlist.push({ source: url, votes: 0, title: title });
		$modalInstance.close();
	};

}]);
