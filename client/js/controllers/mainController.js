angular.module('theeTable.controllers')
  .controller('mainController', ['$scope', 'localStorageService', 'theeTableAuth', function($scope, localStorageService, theeTableAuth) {
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

    $scope.soundcloud = {};

    $scope.search = function(query) {

      SC.initialize({
        client_id: '3fad6addc9d20754f8457461d02465f2'
      });

      SC.get('/tracks', { q: query }, function(tracks) {
        console.log(tracks);
        $scope.$apply(function() {
          $scope.soundcloud.results = tracks;
        });
      });

      $scope.soundcloud.query = '';

    };
  }]);
