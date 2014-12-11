angular.module('theeTable.controllers')
	.controller('roomController', function($scope, $state, $http, $stateParams, $location, $sce, localStorageService) {

		/*************
		 * Socket.IO *
		 *************/

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
			console.log(data);
			$scope.$apply(function() {
				$scope.room.currentTime = data.time;
			})
		});

		socket.on('updatedSongDuration', function(data) {
			// console.log(data);
			$scope.$apply(function() {
				$scope.room.currentSongDuration = data.duration;
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

					// Somehow needs to know the current time of track being played
					// in the room so that newcomers can seek to that time to match
					// the group.

					// console.log(data.currentPosition);
					socket.emit('currentTime', { time: data.currentPosition });
					// widget.seekTo(startAt);

				})

				widget.bind(SC.Widget.Events.PLAY, function(data) {

					// Somehow needs to know the current time of track being played
					// in the room so that newcomers can seek to that time to match
					// the group.

					if (currentTime !== undefined) {
						widget.seekTo(currentTime);
					}

					widget.getCurrentSound(function(currentSound) {

						// gives us the end time in milliseconds.
						// console.log(currentSound.duration);

						$scope.$apply(function(){

							socket.emit('songDuration', { duration: currentSound.duration });
							// $scope.ending = currentSound.duration;
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

					// // needs to tell the room the rotated sequence for newcomers.
					// rotateQueue();
					//
					// // load the widget with the next song on the playlist
					// // of the next DJ.
					// var currentSong = $scope.currentUser.playlist.shift();
					//
					// // rooms may need to have a current song or current dj?
					// // may need to emit something to the room so it can keep track
					// // for newcomers
					// widget.load(currentSong, { show_artwork: true });
					//
					// // may need a currentUser and a room's currentDJ
					// $scope.currentUser.playlist.push(currentSong);
					//
					// updatePlayer();
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

		// var getCurrentSong = function() {
		// 	var currentSong = $scope.currentUser.playlist.shift();
		// 	$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + currentSong );
		// 	$scope.currentUser.playlist.push(currentSong);
		// }
		//
		// var rotateQueue = function() {
		// 	var oldUser = $scope.room.queue.shift();
		// 	$scope.room.queue.push( oldUser );
		// 	var currentUser = $scope.room.queue[0];
		// 	$scope.currentUser = currentUser;
		// }

		$scope.addToQueue = function() {
			// if ($scope.room.queue.length === 0) {
			// 	// queue up the 1st song on the user's playlist
			// 	$scope.isFirstSong = true;
			// 	getCurrentSong();
			// 	setUpPlayer();
			// }
			socket.emit('addToQueue', { user: $scope.$parent.currentUser.username });
			// emit new user added to the queue
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
						// $scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + result.queue[0].source);
						if (result.currentDJ !== null) {
							$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + result.currentSong);
							currentTime = result.currentTime;
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

		$scope.submitPlaylistItemDisabled = function() {
			if ($scope.url === undefined || $scope.url === '') {
				return true;
			}
			return false;
		}

		$scope.submitPlaylistItem = function(url) {
			$scope.url = '';
			socket.emit('newPlaylistItem', { source: url });
		}
	});
