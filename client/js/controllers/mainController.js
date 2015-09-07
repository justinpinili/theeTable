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

    $scope.auth = function(alreadyInRoom) {

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

          $scope.sc = theeTableSoundcloud.setSCinstance(scInit, user.username, user.scID);

          if (!$scope.sc.isConnected()) {

            theeTableSoundcloud.loginSC(function() {
              $scope.getUserInfo(function(retrievedUser) {
                $scope.socket.emit("userName", {username: retrievedUser.username});
                if (!alreadyInRoom) {
                  $location.path("/rooms");
                }
                return;
              });
            });
            return;
          }

          theeTableSoundcloud.setSoundcloudID(user.scID, user.username);

          if (!alreadyInRoom) {
            $location.path("/rooms");
          }
          return;

        });

      }
    }

    // mainController holds the soundcloud instance so it can be used
    // throughout the app
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

  }]);
