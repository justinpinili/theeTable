angular.module('theeTable.directives')
	.directive('volumeForPlayer', [function() {

		/************************************************************
		 *                                                          *
		 ************************************************************/

		return {
			restrict: 'E',
			template: '<div class="volume"><span class="mdi-av-volume-up md-icon"></span> {{ volume }}% <span class="mdi-content-add-circle md-icon"></span><span class="mdi-content-remove-circle md-icon"></span></div>',
			scope: {
				amount: '='
			},
			controller: ['$scope', function($scope) {
				$scope.volume = 100;
				$scope.mute = false;
			}],
			link: function(scope, element, attrs) {
				var innerElementVolumeMute = angular.element(angular.element(element.contents()).contents()[0]);
				var innerElementVolumeUp = angular.element(angular.element(element.contents()).contents()[2]);
				var innerElementVolumeDown = angular.element(angular.element(element.contents()).contents()[3]);
				innerElementVolumeMute.on('click', function(event) {
					if (!scope.mute) {
						scope.mute = true;
						scope.oldVolume = scope.volume;
						scope.volume = 0;
						return;
					}
					scope.mute = false;
					scope.volume = scope.oldVolume;
				});
				innerElementVolumeUp.on('click', function(event) {
					if (scope.volume+10 <= 100) {
						scope.volume += 10
					}
				});
				innerElementVolumeDown.on('click', function(event) {
					if (scope.volume-10 >= 0) {
						scope.volume -= 10
					}
				});

				scope.$watch('volume', function(newValue, oldValue) {
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
