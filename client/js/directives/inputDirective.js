angular.module('theeTable.directives')
.directive('customInputBox', function() {
	return {
		restrict: 'E',
		templateUrl: './js/directives/inputDirective.html',
		scope: {
			socket: '=',
			input: '@'
		},
		controller: ['$scope', 'theeTableRooms', function($scope, theeTableRooms) {

			$scope.newInput = {};
			$scope.prompt = "Send a Message";

			if ($scope.input === 'room') {
				$scope.prompt = "Choose a New Room Name";
			}

			$scope.createDisabled = function() {
				if ($scope.newInput.value === undefined || $scope.newInput.value === '') {
					return true;
				}
				return false;
			};

			$scope.create = function(newValue) {
				if ($scope.input === 'room') {
					theeTableRooms.createRoom(newValue, function(result) {
						if (!result.message) {
							$scope.socket.emit("addRoom", {room: result.name});
							// console.log(result.name);
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
