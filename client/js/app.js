angular.module('theeTable', [
  'ui.router',
  'theeTable.controllers',
  'LocalStorageModule',
  'theeTable.services',
  'theeTable.directives',
  'ui.bootstrap',
  'ui.sortable'
])
  .config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('theeTable');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/app.html'
      })
      .state('rooms', {
        url: '/rooms',
        controller: 'roomsController',
        templateUrl: 'templates/controllers/rooms.html'
      })
      .state('room', {
        url: '/rooms/:roomName',
        controller: 'roomController',
        templateUrl: 'templates/controllers/room.html',
        onEnter: ['socket', function(socket){
          socket.connect();
        }],
        onExit: ['socket', function(socket){
          socket.disconnect();
        }]
      })
      .state('backtorooms', {
        url: '/backtorooms',
        controller: ['$location', function($location) {
          $location.path("/rooms");
        }]
      })
      .state('logout', {
        url: '/logout',
        controller: ['localStorageService', '$location', '$scope', function(localStorageService, $location, $scope) {
          localStorageService.remove('jwt');
          $scope.$parent.showApp = false;
          $scope.$parent.currentUser = undefined;
          $scope.$parent.soundcloudID = undefined;
          if ($scope.$parent.loggedout) {
            $scope.$parent.loggedoutMsg = "You have logged into Thee Table from another source. Good-bye!";
          }
          $location.path("/");
        }]
      });

      $urlRouterProvider.otherwise('/home');
  });

angular.module('theeTable.controllers', []);
angular.module('theeTable.services', []);
angular.module('theeTable.directives', []);
