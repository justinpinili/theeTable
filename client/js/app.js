angular.module('theeTable', [
  'ui.router',
  'theeTable.controllers'
])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        controller: 'mainController',
        templateUrl: 'templates/main.html'
      })
      .state('main.subviews', {
        views: {
          'auth': {
            controller: 'authController',
            templateUrl: 'templates/auth.html'
          }
        }
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
      });

      $urlRouterProvider.otherwise('/main');
  });

angular.module('theeTable.controllers', []);
