angular.module('theeTable.directives')
	.directive('soundCloudPlayer', function() {
		return {
			restrict: 'E',
			template: '<iframe id="sc-widget" src="{{ thisSong }}" width="100%" height="98%" scrolling="no" frameborder="no"></iframe>',
			scope: {
				socket: '=',
				currentSong: '=',
				room: '=',
				username: '=',
				title: '='
			},
			controller: ['$scope', '$sce', function($scope, $sce) {

				var widgetIframe;
				var widget;
				var currentTime;

				$scope.thisSong = '';

				$scope.sce = function(value) {
					return $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + value);
				}

				$scope.updatePlayer = function(newSong) {
					// Bind the events with the SoundCloud widget
					if (newSong) {
						widget.load(newSong, { show_artwork: true });
					}

					widget.bind(SC.Widget.Events.READY, function() {
						widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
							// should only emit from currentDJ
							if ($scope.room.currentDJ === $scope.username) {
								$scope.socket.emit('currentTime', { time: data.currentPosition });
							}
						});
						widget.bind(SC.Widget.Events.PLAY, function(data) {

							if ($scope.room.currentTime !== null) {
								widget.seekTo($scope.room.currentTime);
							}

							if ($scope.room.currentSong) {
								widget.getCurrentSound(function(currentSound) {
									$scope.$apply(function(){
										$scope.title = currentSound.title;
									});
								});
							} else {
								delete $scope.title;
								widget.seekTo($scope.oldValue.length);
								widget.unbind(SC.Widget.Events.READY);
								widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
								widget.unbind(SC.Widget.Events.PLAY);
								widget.unbind(SC.Widget.Events.FINISH);
								return;
							}

						});
						widget.setVolume(100);
						widget.bind(SC.Widget.Events.FINISH, function() {
							// unbind the widget from the listeners that we don't need anymore.
							widget.unbind(SC.Widget.Events.READY);
							widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
							widget.unbind(SC.Widget.Events.PLAY);
							widget.unbind(SC.Widget.Events.FINISH);

							if ($scope.room.currentDJ === $scope.username) {
								$scope.socket.emit('updatePlaylist', { username: $scope.username });
							}
						});
						widget.play();
					});
				};

				$scope.setUpPlayer = function() {
					// the DOM element needs to exist before it can be identified
					setTimeout(function(){
						widgetIframe = document.getElementById('sc-widget');
						widget       = SC.Widget(widgetIframe);
						$scope.updatePlayer();
					}, 500);
				};

			}],
			link: function(scope, element, attrs) {
				var first = true;

				scope.$watch('currentSong', function(newValue, oldValue) {
					if (!first && newValue === null) {
						scope.oldValue = oldValue;
						delete scope.title;
						scope.updatePlayer('');
					}

					if (newValue !== undefined) {
						if (newValue !== null) {
							if (first) {
								scope.thisSong = scope.sce(newValue.source);
								scope.setUpPlayer();
								first = false;
							} else {
								delete scope.title;
								scope.updatePlayer(newValue.source);
							}
						}
					}
				});

			}
		}
	});
