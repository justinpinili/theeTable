angular.module('theeTable.controllers')
  .controller('mainController', ['$scope', 'localStorageService', 'theeTableAuth', '$modal', function($scope, localStorageService, theeTableAuth, $modal) {
    $scope.getUserInfo = function(callback) {
      theeTableAuth.getUserInfo(function(result) {
        if (!result.message) {
          $scope.currentUser = result;
          if (callback) {
            callback(result);
          }
          return;
        }
        return;
      });
    }

    $scope.managePlaylist = function() {
      var modalInstance = $modal.open({
        templateUrl: './../templates/managePlaylist.html',
        controller: 'managePlaylistController',
        size: 'lg'
      });
    };
  }]);
