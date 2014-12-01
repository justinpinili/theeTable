angular.module('theeTable', [
  'ui.router'
])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        // controller: 'MainController',
        templateUrl: 'templates/main.html'
      });
      // .state('main.subviews', {
      //   views: {
      //     'search': {
      //       //controller: 'MainController',
      //       templateUrl: 'app/search/search.html'
      //     },
      //     'user': {
      //       controller: 'UserController',
      //       templateUrl: 'app/user/user.html'
      //     }
      //   }
      // })
      // .state('signup', {
      //   url: '/signup',
      //   controller: 'AuthController',
      //   templateUrl: 'app/user/signup.html'
      // })
      // .state('login', {
      //   url: '/login',
      //   controller: 'AuthController',
      //   templateUrl: 'app/user/login.html'
      // });

      $urlRouterProvider.otherwise('/main');
  });
