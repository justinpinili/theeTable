angular.module('theeTable.directives')
	.directive('soundCloudPlayer', [function() {

		/************************************************************
		 * soundCloudPlayer directive renders the soundcloud API    *
		 * widget and controls all the behavior associated with the	*
		 * player.                                                	*
		 *                                                          *
		 * Current Song                                             *
		 * Current Time (updated frequently)                        *
		 * Current DJ                                               *
		 * Queue Rotation                                           *
		 * Update Current DJ's playlist                             *
		 ************************************************************/

		return {
			restrict: 'E',
			template: '<iframe id="sc-widget" src="{{ thisSong }}" width="100%" height="98%" scrolling="no" frameborder="no"></iframe>',
			scope: {
				socket: '=',
				currentSong: '=',
				room: '=',
				username: '=',
				title: '=',
				sound: '='
			},
			controller: ['$scope', '$sce', function($scope, $sce) {

				var widgetIframe;
				var widget;
				var currentTime;

				var unbind = function() {
					widget.unbind(SC.Widget.Events.READY);
					widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
					widget.unbind(SC.Widget.Events.PLAY);
					widget.unbind(SC.Widget.Events.FINISH);
				}

				$scope.thisSong = '';

				// makes sure that the url is safe to load into the soundcloud api widget
				$scope.sce = function(value) {
					return $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + value);
				}

				// logic that is set up each time a new song is ready to play
				// prepares the soundcloud api widget
				$scope.updatePlayer = function(newSong) {
					if (newSong) {
						widget.load(newSong+'?single_active=false', { show_artwork: true });
					}

					// Bind the events with the SoundCloud widget
					widget.bind(SC.Widget.Events.READY, function() {
						widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
							// should only emit from currentDJ
							if ($scope.room.currentDJ === $scope.username) {
								$scope.socket.emit('currentTime', { time: data.currentPosition });
							}
						});
						widget.bind(SC.Widget.Events.PLAY, function(data) {

							// if the client is new and a song is playing, skip to the current time
							if ($scope.room.currentDJ !== $scope.username) {
								widget.seekTo($scope.room.currentTime);
							}

							// if a song is playing, configure the title, otherwise, unbind the widget
							// since it's not being used
							if ($scope.room.currentSong) {
								widget.getCurrentSound(function(currentSound) {
									$scope.$apply(function(){
										$scope.title = currentSound.title;
									});
								});
							} else {
								delete $scope.title;
								if ($scope.oldValue){
									widget.seekTo($scope.oldValue.length);
								}
								delete $scope.oldValue;
								unbind();
								return;
							}

						});

						widget.setVolume($scope.sound);

						//once a song is finished
						widget.bind(SC.Widget.Events.FINISH, function() {

							// unbind the widget from the listeners that we don't need anymore.
							unbind();

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

				$scope.setVolume = function(volumeValue) {
					if (widget) {
						widget.setVolume(volumeValue);
					}
				};

			}],
			link: function(scope, element, attrs) {
				var first = true;

				// set up a watcher so that we can update the player once a new song is configured
				scope.$watch('currentSong', function(newValue, oldValue) {
					if (!first && newValue === null) {
						scope.oldValue = oldValue;
						delete scope.title;
						scope.updatePlayer('');
					}

					if (newValue !== undefined) {
						if (newValue !== null) {
							if (first) {
								scope.thisSong = scope.sce(newValue.source+'?single_active=false');
								scope.setUpPlayer();
								first = false;
							} else {
								delete scope.title;
								scope.updatePlayer(newValue.source+'?single_active=false');
							}
						}
					}
				});

				scope.$watch('sound', function(newValue, oldValue) {
					if (newValue !== undefined) {
						scope.setVolume(newValue);
					}
				});

			}
		}
	}]);
