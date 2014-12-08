angular.module('theeTable.controllers')
	.controller('roomController', function($scope, $state, $http, $stateParams, $location, $sce) {

		var socket = io.connect();

		socket.emit('roomEntered', { room: $stateParams.roomName, user: Date.now()});

		socket.on('usersInRoom', function(data) {
			$scope.$apply(function() {
				$scope.room.users = data.users;
				// console.log($scope.room.users);
			});
		});

		socket.on('updatedChat', function(data) {
			$scope.$apply(function() {
				$scope.room.chat = data.chat;
			})
		});

		socket.on('updatedQueue', function(data) {
			$scope.$apply(function() {
				$scope.room.queue = data.queue;
			})
		});

		var setUpPlayer = function() {
			setTimeout(function(){
				var widgetIframe = document.getElementById('sc-widget');
				var	widget       = SC.Widget(widgetIframe);
				var	newSoundUrl  = 'https://soundcloud.com/blondish/junge-junge-beautiful-girl-preview';

				widget.bind(SC.Widget.Events.READY, function() {

					widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
						// console.log(data);
					})

					widget.bind(SC.Widget.Events.PLAY, function(d) {
		        // get information about currently playing sound
						widget.seekTo(36661.572);
		        widget.getCurrentSound(function(currentSound) {
		          console.log(currentSound);
							$scope.$apply(function(){
								$scope.title = currentSound.title;
							});
		        });
		      });

					widget.setVolume(100);
					// get the value of the current position

					widget.bind(SC.Widget.Events.FINISH, function() {
						widget.load(newSoundUrl, {
							show_artwork: true
						});
						setUpPlayer();
					});

					widget.play();
				});

			}, 500);
		};

		$http.get('http://localhost:1337/rooms/'+$stateParams.roomName)
			.success(function(result) {
				if (!result.message) {
					// console.log(result);
					$scope.room = result;
					// $scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + result.queue[0].source);
					// setUpPlayer();
					return;
				}
				// $scope.message = result.message;
				// console.log(result.message);
				alert(result.message);
				$location.path("/rooms");
				return;
			})
			.error(function(error) {
				console.log(error);
				return;
			});

		$scope.submitMessageDisabled = function() {
			if ($scope.msg === undefined || $scope.msg === '') {
				return true;
			}
			return false;
		}

		$scope.submitMessage = function(message) {
			$scope.msg = '';
			socket.emit('newChatMessage', { msg: message });
		}

		$scope.submitQueueItemDisabled = function() {
			if ($scope.url === undefined || $scope.url === '') {
				return true;
			}
			return false;
		}

		$scope.submitQueueItem = function(url) {
			$scope.url = '';
			socket.emit('newQueueItem', { source: url });
		}
	});
