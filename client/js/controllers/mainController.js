angular.module('theeTable.controllers')
  .controller('mainController', ['$scope', 'localStorageService', 'theeTableAuth', '$modal', 'socket', 'theeTableSoundcloud', 'theeTableUrl', '$location', function($scope, localStorageService, theeTableAuth, $modal, socket, theeTableSoundcloud, theeTableUrl, $location) {

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

    // initialize client with app credentials
    var scInit = SC.initialize({
      client_id: theeTableUrl.getID(),
      redirect_uri: '' + theeTableUrl.getUrl() + '/success'
    });

    $scope.sc = theeTableSoundcloud.setSCinstance(scInit);

    $scope.socket = socket;

    $scope.socket.on("signOn", function(data) {
      if ($scope.currentUser) {
        if (data.username === $scope.currentUser.username &&
            data.loginTime !== $scope.currentUser.loginTime) {
            $scope.loggedout = true;
            $location.path('/logout');
          }
      }
    });

    $scope.$watch("loggedoutMsg", function(newValue, oldValue) {
      if (newValue !== undefined) {
        setTimeout(function() {
          $scope.$apply(function() {
            delete $scope.loggedoutMsg;
          });
        }, 10000);
      }
    });

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

    $scope.auth = function() {
      if (theeTableAuth.verifyJwt(true)) {
        $scope.showApp = true;
        $location.path('/rooms');
        return;
      }

      var modalInstance = $modal.open({
        templateUrl: './../templates/modals/auth.html',
        controller: 'authController',
        size: 'lg',
        resolve: {
          userInRoom: function() {
            return $scope.userInRoom;
          },
          getUserInfo: function() {
            return $scope.getUserInfo;
          },
          currentSocket: function() {
            return $scope.socket;
          },
          loginSC: function() {
            return $scope.loginSC;
          }
        }
      });
    }

    $scope.managePlaylist = function() {
      var modalInstance = $modal.open({
        templateUrl: './../templates/modals/managePlaylist.html',
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
