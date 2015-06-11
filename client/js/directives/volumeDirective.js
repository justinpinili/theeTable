angular.module('theeTable.directives')
	.directive('volumeForPlayer', [function() {

		/************************************************************
		 *                                                          *
		 ************************************************************/

		return {
			restrict: 'E',
			template: '<div class="volume"><span class="mdi-av-volume-up md-icon"></span> {{ Math.round(sound*100) }}% <span class="mdi-content-add-circle md-icon"></span><span class="mdi-content-remove-circle md-icon"></span></div>',
			scope: {
				sound: '='
			},
			controller: ['$scope', function($scope) {
				// $scope.sound = 100;
				$scope.mute = false;
				$scope.Math = window.Math;
			}],
			link: function(scope, element, attrs) {
				var innerElementVolumeMute = angular.element(angular.element(element.contents()).contents()[0]);
				var innerElementVolumeUp = angular.element(angular.element(element.contents()).contents()[2]);
				var innerElementVolumeDown = angular.element(angular.element(element.contents()).contents()[3]);
				innerElementVolumeMute.on('click', function(event) {
					if (!scope.mute && scope.sound !== 0) {
						scope.mute = true;
						scope.oldVolume = scope.sound;
						scope.sound = 0;
						return;
					}
					scope.mute = false;
					scope.sound = scope.oldVolume;
				});
				innerElementVolumeUp.on('click', function(event) {
					if (scope.sound+0.1 <= 1) {
						scope.oldVolume = scope.sound;
						scope.sound += 0.1;
					}
				});
				innerElementVolumeDown.on('click', function(event) {
					if (scope.sound-0.1 >= 0) {
						scope.oldVolume = scope.sound;
						scope.sound -= 0.1;
					}
				});

				scope.$watch('sound', function(newValue, oldValue) {
					var innerElementVolumeMute = angular.element(angular.element(element.contents()).contents()[0]);
					if (newValue === 0) {
						innerElementVolumeMute.removeClass('mdi-av-volume-up');
						innerElementVolumeMute.addClass('mdi-av-volume-off');
					} else {
						innerElementVolumeMute.removeClass('mdi-av-volume-off');
						innerElementVolumeMute.addClass('mdi-av-volume-up');
					}
				});
			}
		}
	}]);
