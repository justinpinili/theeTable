angular.module('theeTable.controllers')
  .controller('mainController', ['$scope', 'localStorageService', 'theeTableAuth', '$modal', 'socket', function($scope, localStorageService, theeTableAuth, $modal, socket) {

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

    $scope.viewFavorites = function() {
      var modalInstance = $modal.open({
        templateUrl: './../templates/viewFavorites.html',
        controller: 'viewFavoritesController',
        size: 'lg',
        resolve: {
          currentSocket: function () {
            return $scope.socket;
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

    $scope.loginSC = function(callback) {

      // initiate auth popup
      $scope.sc.connect(function() {

        // logic in here after connection and pop up closes
        $scope.sc.get('/me', function(me) {

          $scope.$apply(function() {
            $scope.soundcloudID = { id: me.id,
                                    username: me.permalink };
          });

          if (callback) {
            callback();
          }

        });

      });

    };

    // initialize client with app credentials
    SC.initialize({
      client_id: '3fad6addc9d20754f8457461d02465f2',
      redirect_uri: 'http://localhost:1337/success'
    });

    $scope.sc = SC;

    $scope.socket = socket;

  }]);
