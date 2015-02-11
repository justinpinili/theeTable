angular.module('theeTable.controllers')
  .controller('mainController', ['$scope', 'localStorageService', 'theeTableAuth', '$modal', 'socket', 'theeTableSoundcloud', 'theeTableUrl', function($scope, localStorageService, theeTableAuth, $modal, socket, theeTableSoundcloud, theeTableUrl) {

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

    $scope.viewFavoriteRooms = function() {
      var modalInstance = $modal.open({
        templateUrl: './../templates/viewFavoriteRooms.html',
        controller: 'viewFavoriteRoomsController',
        size: 'lg',
        resolve: {
          currentSocket: function () {
            return $scope.socket;
          }
        }
      });
    };

    $scope.getSoundcloudID = function() {
      return theeTableSoundcloud.getSoundcloudID();
    }

    $scope.getSCinstance = function() {
      return theeTableSoundcloud.getSCinstance();
    }

    $scope.loginSC = function(callback) {

      theeTableSoundcloud.loginSC(function() {
        $scope.soundcloudID = theeTableSoundcloud.getSoundcloudID();

        if (callback) {
          callback();
        }
      });
    };

    $scope.likeSongOnSC = function(id) {
      theeTableSoundcloud.like(id);
    }

    // initialize client with app credentials
    var scInit = SC.initialize({
      client_id: theeTableUrl.getID(),
      redirect_uri: '' + theeTableUrl.getUrl() + '/success'
    });

    $scope.sc = theeTableSoundcloud.setSCinstance(scInit);

    $scope.socket = socket;

  }]);
