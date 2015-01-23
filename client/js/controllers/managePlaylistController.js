angular.module('theeTable.controllers')
.controller('managePlaylistController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', function($scope, $modalInstance, $modal, theeTableAuth) {

	$scope.soundcloud = {};
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
				playlist.push({ source: $scope.playlist[index].source, votes: $scope.playlist[index].votes });
			}
			$scope.$parent.newPlaylist = playlist;
		}
	};

	$scope.remove = function(index) {
		$scope.playlist.splice(index, 1);
		var playlist = [];
		for (var index = 0; index < $scope.playlist.length; index++) {
			playlist.push({ source: $scope.playlist[index].source, votes: $scope.playlist[index].votes });
		}
		$scope.$parent.newPlaylist = playlist;
	}

	theeTableAuth.getUserInfo(function(user) {
		$scope.playlist = user.playlist;
	});

}]);
