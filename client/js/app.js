angular.module('theeTable', [
  'ui.router',
  'theeTable.controllers',
  'LocalStorageModule',
  'theeTable.services'
])
  .config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('theeTable');

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'authController',
        templateUrl: 'templates/auth.html'
      })
      .state('rooms', {
        url: '/rooms',
        controller: 'roomsController',
        templateUrl: 'templates/rooms.html'
      })
      .state('room', {
        url: '/rooms/:roomName',
        controller: 'roomController',
        templateUrl: 'templates/room.html'
      })
      .state('logout', {
        url: '/logout',
        controller: function(localStorageService, $location) {
          localStorageService.remove('jwt');
          $location.path("/");
        }
      });

      $urlRouterProvider.otherwise('/home');
  });

angular.module('theeTable.controllers', []);
angular.module('theeTable.services', []);
