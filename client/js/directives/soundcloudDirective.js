angular.module('theeTable.directives')
	.directive('soundCloudPlayer', function() {
		return {
			restrict: 'E',
			template: '<div>Herro<iframe id="sc-widget" src="{{ thisSong }}" width="100%" height="98%" scrolling="no" frameborder="no"></iframe></div>',
			scope: {
				socket: '=',
				currentSong: '=',
				room: '=',
				username: '=',
				title: '='
			},
			controller: ['$scope', '$sce', function($scope, $sce) {
				// console.log("controller setup");
				// console.log($scope);

				var widgetIframe;
				var widget;
				var currentTime;

				// console.log($scope);

				$scope.thisSong = '';

				$scope.sce = function(value) {
					return $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + value);
				}

				$scope.updatePlayer = function() {
					// Bind the events with the SoundCloud widget
					console.log("start updatePlayer");
					console.log(SC);

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
							widget.getCurrentSound(function(currentSound) {
								$scope.$apply(function(){
									$scope.title = currentSound.title;
								});
							});

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
						console.log("end of updatePlayer");
					});
				};

				$scope.setUpPlayer = function() {
					// the DOM element needs to exist before it can be identified
					setTimeout(function(){
						widgetIframe = document.getElementById('sc-widget');
						// console.log(SC.Widget);
						widget       = SC.Widget(widgetIframe);
						console.log(widget);
						console.log("done setting up");
						$scope.updatePlayer();
					}, 500);
				};

			}],
			link: function(scope, element, attrs) {
				// scope.setUpPlayer();
				// console.log(attrs);
				scope.$watch('currentSong', function(newValue, oldValue) {
					if (newValue !== undefined) {
						if (newValue !== null) {
							scope.thisSong = scope.sce(newValue);
							var source = scope.thisSong;
							scope.setUpPlayer();
						}
					}
				});
				// scope.socket.emit('hello', { hello: 'hello' });

			}
		}
	});
