angular.module('theeTable.controllers')
  .controller('mainController', function($scope, $state) {

    $state.transitionTo('main.subviews');
  });
