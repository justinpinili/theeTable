angular.module('theeTable.directives')
.directive('customInputBox', function() {

	/************************************************************
	 * customInputBox directive renders an input box with error *
	 * div. it controls the logic after a user submits an input	*
	 * 																													*
	 * used for chat messages and creating a room               *
	 ************************************************************/

	return {
		restrict: 'E',
		templateUrl: './../../templates/directives/inputDirective.html',
		scope: {
			socket: '=',
			input: '@'
		},
		controller: ['$scope', 'theeTableRooms', function($scope, theeTableRooms) {

			// initialization logic

			$scope.newInput = {};
			$scope.prompt = "Send a Message";

			if ($scope.input === 'room') {
				$scope.prompt = "Choose a New Room Name";
			}

			// disables submission if it's empty
			$scope.createDisabled = function() {
				if ($scope.newInput.value === undefined || $scope.newInput.value === '') {
					return true;
				}
				return false;
			};

			// notify the DB of the user's input
			$scope.create = function(newValue) {
				if ($scope.input === 'room') {
					theeTableRooms.createRoom(newValue, function(result) {
						if (!result.message) {
							$scope.socket.emit("addRoom", {room: result.name});
							$scope.$parent.close = true;
							return;
						}
						$scope.message = result.message;
					});
				} else {
					$scope.socket.emit('newChatMessage', { msg: newValue })
				}
				$scope.newInput.value = '';
				return;
			};

		}],
		link: function(scope, element, attrs) {

			$(document).ready(function() {
				setTimeout(function() {
					$.material.init();
				}, 0);
			});
		}
	}
});
