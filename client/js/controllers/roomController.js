angular.module('theeTable.controllers')
	.controller('roomController', function($scope, $state, $http, $stateParams, $location, $sce, localStorageService) {

		/*************
		 * Socket.IO *
		 *************/

		$scope.room = {};

		var socket = io.connect();

		socket.emit('roomEntered', { room: $stateParams.roomName, user: 'justin'});

		socket.on('usersInRoom', function(data) {
			$scope.$apply(function() {
				$scope.room.users = data.users;
			});
		});

		socket.on('updatedChat', function(data) {
			$scope.$apply(function() {
				$scope.room.chat = data.chat;
			})
		});

		socket.on('updatedPlaylist', function(data) {
			// console.log(data);
			$scope.$apply(function() {
				$scope.$parent.currentUser.playlist = data.playlist;
				socket.emit('newQueue', { queue: $scope.room.queue });
			})
		});

		socket.on('updatedQueue', function(data) {
			$scope.$apply(function() {
				$scope.room.queue = data.queue;
				if (data.currentDJ) {
					$scope.room.currentDJ = data.currentDJ;
					$scope.room.currentSong = data.currentSong;
					$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + data.currentSong);
					setUpPlayer();
				}
			});
		});

		socket.on('updatedCurrentTime', function(data) {
			// console.log(data);
			$scope.$apply(function() {
				$scope.room.currentTime = data.time;
			})
		});

		// socket.on('updatedSongDuration', function(data) {
		// 	// console.log(data);
		// 	$scope.$apply(function() {
		// 		$scope.room.currentSongDuration = data.duration;
		// 	})
		// });

		// socket.on('nextSong', function(data) {
		// 	// console.log(data);
		// 	$scope.$apply(function() {
		// 		$scope.room.currentDJ = data.currentDJ;
		// 		$scope.room.currentSong = data.currentSong;
		// 		widget.load($scope.room.currentSong, { show_artwork: true });
		// 		updatePlayer();
		// 	})
		// });

		socket.on('rotatedQueue', function(data) {
			// console.log(data);
			$scope.$apply(function() {
				$scope.room.queue = data.queue;
				$scope.room.currentDJ = data.currentDJ;
				$scope.room.currentSong = data.currentSong;
				$scope.room.currentTime = data.currentTime;
				widget.load($scope.room.currentSong, { show_artwork: true });
				updatePlayer();
			})
		});

		/*************
		* SoundCloud *
		**************/

		var widgetIframe;
		var widget;
		var currentTime;

		var updatePlayer = function() {
			// Bind the events with the SoundCloud widget
			widget.bind(SC.Widget.Events.READY, function() {
				widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
					// should only emit from currentDJ
					if ($scope.room.currentDJ === $scope.$parent.currentUser.username) {
						socket.emit('currentTime', { time: data.currentPosition });
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

					if ($scope.room.currentDJ === $scope.$parent.currentUser.username) {
						socket.emit('updatePlaylist', { username: $scope.$parent.currentUser.username });
					}
				});
				widget.play();
			});
		};

		var setUpPlayer = function(currentTime) {
			// the DOM element needs to exist before it can be identified
			setTimeout(function(){
				widgetIframe = document.getElementById('sc-widget');
				widget       = SC.Widget(widgetIframe);
				updatePlayer();
			}, 500);
		};

		var rotateQueue = function() {
			var oldUser = $scope.room.queue.shift();
			// console.log(oldUser)
			var song;
			$scope.room.queue.push( oldUser );
			// console.log($scope.room.queue);
			if ($scope.room.queue[0] === $scope.$parent.currentUser.username) {
				song = $scope.$parent.currentUser.playlist[0].source;
			}
			socket.emit('newQueue', { queue: $scope.room.queue, song: song });
			// var currentUser = $scope.room.queue[0];
			// $scope.currentUser = currentUser;
		}

		/**************
		* Room Set-up *
		***************/
		var jwt = localStorageService.get("jwt");
		if (!jwt) {
			alert("you must be logged in to access Thee Table.");
			$location.path("/main");
		} else {
			$http.get('http://localhost:1337/rooms/'+$stateParams.roomName+'?jwt_token='+jwt)
				.success(function(result) {
					if (!result.message) {
						$scope.room = result;
						$scope.$parent.getUserInfo();
						if (result.currentDJ !== null) {
							$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + result.currentSong);
							// currentTime = result.currentTime;
							setUpPlayer();
						}
						return;
					}
					alert(result.message);
					$location.path("/rooms");
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		}

		$scope.addToQueue = function() {
			socket.emit('addToQueue', { user: $scope.$parent.currentUser.username });
		};

		$scope.newChatMessage = {};

		$scope.submitMessageDisabled = function() {
			if ($scope.newChatMessage.msg === undefined || $scope.newChatMessage.msg === '') {
				return true;
			}
			return false;
		};

		$scope.submitMessage = function(message) {
			$scope.msg = '';
			socket.emit('newChatMessage', { msg: message });
		};

		$scope.newPlaylistItem = {};

		$scope.submitPlaylistItemDisabled = function() {
			if ($scope.newPlaylistItem.url === undefined || $scope.newPlaylistItem.url === '') {
				return true;
			}
			return false;
		};

		$scope.submitPlaylistItem = function(url) {
			$scope.url = '';
			socket.emit('newPlaylistItem', { source: url });
		};
	});
