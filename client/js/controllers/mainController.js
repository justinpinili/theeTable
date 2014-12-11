angular.module('theeTable.controllers')
  .controller('mainController', function($scope, $http, localStorageService) {

    $scope.getUserInfo = function() {
      var jwt = localStorageService.get("jwt");
      $http.get('http://localhost:1337/user?jwt_token='+jwt)
        .success(function(result) {
          if (!result.message) {
            $scope.currentUser = result;
            // $scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + result.queue[0].source);
            // setUpPlayer();
            return;
          }
          // alert(result.message);
          // $location.path("/rooms");
          return;
        })
        .error(function(error) {
          console.log(error);
          return;
        });
    }
  });
