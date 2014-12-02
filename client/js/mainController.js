angular.module('theeTable.controllers')
  .controller('mainController', function($scope, $state) {

    $scope.current = 'login';
    $scope.url = 'http://localhost:1337/user/login';

    $scope.switchForm = function() {
      if ($scope.current === 'login') {
        $scope.current = 'signup';
        $scope.url = 'http://localhost:1337/user/new';
      } else {
        $scope.current = 'login';
        $scope.url = 'http://localhost:1337/user/login';
      }
      return;
    }

    $state.transitionTo('main.subviews');
  });
