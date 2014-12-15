angular.module('theeTable.controllers')
  .controller('mainController', function($scope, localStorageService, theeTableAuth) {
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
  });
