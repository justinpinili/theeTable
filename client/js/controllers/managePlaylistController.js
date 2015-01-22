angular.module('theeTable.controllers')
.controller('managePlaylistController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', function($scope, $modalInstance, $modal, theeTableAuth) {

	$scope.soundcloud = {};

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

	theeTableAuth.getUserInfo(function(user) {
		// console.log(user);
		$scope.playlist = user.playlist;
	});

}]);
