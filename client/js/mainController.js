angular.module('theeTable.controllers')
  .controller('mainController', function($scope, $state) {

    $scope.current = 'login';

    $scope.isCurrent = function (view) {
      if (view === $scope.current) {
        return true;
      }
      return false;
    }

    $scope.switchForm = function() {
      if ($scope.current === 'login') {
        $scope.current = 'signup';
      } else {
        $scope.current = 'login';
      }
    }

    $state.transitionTo('main.subviews');
  });
