angular.module('theeTable.controllers')
  .controller('mainController', ['$scope', 'localStorageService', 'theeTableAuth', '$modal', 'theeTableSocket', 'theeTableSoundcloud', 'theeTableUrl', '$location', 'theeTableAuth', function($scope, localStorageService, theeTableAuth, $modal, theeTableSocket, theeTableSoundcloud, theeTableUrl, $location, theeTableAuth) {

    /************************************************************
     * mainController that holds the current user's information *
     * and allows that information to be passed across the      *
     * application.                                             *
     *                                                          *
     *  - Playlist                                              *
     *  - Favorites                                             *
     *  - Favorite Rooms                                        *
     *  - soundcloud instance for theeTable application         *
     ************************************************************/

    $scope.socket = theeTableSocket;

    $scope.socket.on("signOn", function(data) {
      if ($scope.currentUser) {
        if (data.username === $scope.currentUser.username &&
            data.loginTime !== $scope.currentUser.loginTime) {
            $scope.loggedout = true;
            $location.path('/logout');
          }
      }
    });

    $scope.showApp;

    var setShowApp = function(newValue) {
      $scope.showApp = newValue;
    }

    $scope.inRoom = function() {
      if ($scope.userInRoom) {
        return true;
      }
      return false;
    };

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
    };

    // Information is shown in a
    // modal with it's own controller and
    // template - manage and view are prefixed

    $scope.credits = function() {
      var modalInstance = $modal.open({
        templateUrl: './../templates/modals/credits.html',
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
          $scope.closeModal = function() {
            $modalInstance.close();
          }
        }],
        size: 'sm'
      });
    }

    $scope.auth = function() {

      if (localStorageService.get("jwt") === null) {

        var scInit = SC.initialize({
          client_id: theeTableUrl.getID(),
          redirect_uri: '' + theeTableUrl.getUrl() + '/success'
        });

        $scope.sc = theeTableSoundcloud.setSCinstance(scInit);

        theeTableSoundcloud.loginSC(function() {

          $scope.getUserInfo(function(retrievedUser) {
            $scope.socket.emit("userName", {username: retrievedUser.username});
            $location.path("/rooms");
            return;
          });

        });

      } else {

        theeTableAuth.getUserInfo(function(user) {

          var scInit = SC.initialize({
            client_id: theeTableUrl.getID(),
            access_token: user.accessToken,
            redirect_uri: '' + theeTableUrl.getUrl() + '/success'
          });

          $scope.sc = theeTableSoundcloud.setSCinstance(scInit);

          if (!$scope.sc.isConnected()) {

            theeTableSoundcloud.loginSC(function() {
              $scope.getUserInfo(function(retrievedUser) {
                $scope.socket.emit("userName", {username: retrievedUser.username});
                $location.path("/rooms");
                return;
              });
            });
            return;
          }

          $location.path("/rooms");

        });

      }
    }

    $scope.viewFavorites = function() {
      var modalInstance = $modal.open({
        templateUrl: './../templates/modals/viewFavorites.html',
        controller: 'viewFavoritesController',
        size: 'lg',
        resolve: {
          currentSocket: function () {
            return $scope.socket;
          }
        }
      });
    };

    $scope.viewFavoriteRooms = function() {
      var modalInstance = $modal.open({
        templateUrl: './../templates/modals/viewFavoriteRooms.html',
        controller: 'viewFavoriteRoomsController',
        size: 'lg',
        resolve: {
          currentSocket: function () {
            return $scope.socket;
          }
        }
      });
    };

    // mainController holds the soundcloud instance so it can be used
    // throughout the app

    $scope.getSoundcloudID = function() {
      return theeTableSoundcloud.getSoundcloudID();
    };

    $scope.getSCinstance = function() {
      return theeTableSoundcloud.getSCinstance();
    };

    $scope.loginSC = function(callback) {
      theeTableSoundcloud.loginSC(function() {
        $scope.$apply(function() {
          $scope.soundcloudID = theeTableSoundcloud.getSoundcloudID();
        });

        if (callback) {
          callback($scope.soundcloudID);
        }
        return;
      });
      return;
    };

    $scope.likeSongOnSC = function(id) {
      theeTableSoundcloud.like(id);
      return;
    };

  }]);
