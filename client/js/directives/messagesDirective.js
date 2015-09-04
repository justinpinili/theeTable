angular.module('theeTable.directives')
.directive('messagesTab', [function() {

	/************************************************************
	 * customInputBox directive renders an input box with error *
	 * div. it controls the logic after a user submits an input	*
	 * 																													*
	 * used for chat messages              *
	 ************************************************************/

	return {
		restrict: 'E',
		templateUrl: './../../templates/directives/messagesDirective.html',
		scope: {
			socket: '=',
			input: '@',
			roomLength: '=',
			roomChat: '=',
		},
		controller: ['$scope', 'theeTableRooms', function($scope, theeTableRooms) {

			// initialization logic

			$scope.newInput = {};

			// disables submission if it's empty
			$scope.createDisabled = function() {
				if ($scope.newInput.value === undefined || $scope.newInput.value === '') {
					return true;
				}
				return false;
			};

			// notify the DB of the user's input
			$scope.create = function(newValue) {
				$scope.socket.emit('newChatMessage', { msg: newValue })
				$scope.newInput.value = '';
				return;
			};

			$scope.tab = function() {
				$scope.showing = !$scope.showing;
			}

			$scope.showing = false;

		}],
		link: function(scope, element, attrs) {

			$(document).ready(function() {
				setTimeout(function() {
					$.material.init();
				}, 0);
			});

			scope.$watch('showing', function(value) {
				if (value) {
					element.removeClass('messages-hide');
					element.addClass('messages-show');
					return;
				}
				element.addClass('messages-hide');
				element.removeClass('messages-show');
			});

		}
	}
}]);
