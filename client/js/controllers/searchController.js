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

	$scope.searchSC = function() {
		var modalInstance = $modal.open({
			templateUrl: './../templates/search.html',
			controller: 'searchController',
			size: 'lg'
		});
	}

	$scope.updatePlaylist = function(url, title) {
		$scope.$parent.newURL = url;
		playlist.push({ source: url, votes: 0 });
		$modalInstance.close();
	};

}]);
