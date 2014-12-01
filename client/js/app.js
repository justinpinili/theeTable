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
          'signup': {
            controller: 'signUpController',
            templateUrl: 'templates/signup.html'
          },
          'login': {
            controller: 'logInController',
            templateUrl: 'templates/login.html'
          }
        }
      });

      $urlRouterProvider.otherwise('/main');
  });

angular.module('theeTable.controllers', []);
