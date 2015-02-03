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
        size: 'lg',
        resolve: {
          loginSC: function () {
            return $scope.loginSC;
          },
          getSoundcloudID: function() {
            return $scope.getSoundcloudID;
          },
          getSCinstance: function() {
            return $scope.getSCinstance;
          }
        }
      });
    };

    $scope.getSoundcloudID = function() {
      return $scope.soundcloudID;
    }

    $scope.getSCinstance = function() {
      return $scope.sc;
    }

    $scope.loginSC = function() {

      // initiate auth popup
      $scope.sc.connect(function() {

        $scope.sc.get('/me', function(me) {
          $scope.soundcloudID = me.id;
        });

      });
    };

    // initialize client with app credentials
    SC.initialize({
      client_id: '3fad6addc9d20754f8457461d02465f2',
      redirect_uri: 'http://localhost:1337/success'
    });

    $scope.sc = SC;

  }]);
