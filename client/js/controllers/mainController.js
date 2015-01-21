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

    $scope.searchSC = function() {
      var modalInstance = $modal.open({
        templateUrl: './../templates/search.html',
        controller: 'searchController',
        size: 'lg',
        // resolve: {
        //   items: function () {
        //     return $scope.items;
        //   }
        // }
      });
    };
  }]);
