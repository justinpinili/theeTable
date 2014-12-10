angular.module('theeTable.controllers')
	.controller('roomController', function($scope, $state, $http, $stateParams, $location, $sce) {

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
				$scope.currentUser.playlist = data.playlist;
			})
		});

		/*************
		* SoundCloud *
		**************/

		var widgetIframe;
		var widget;

		var updatePlayer = function() {

			// Bind the events with the SoundCloud widget
			widget.bind(SC.Widget.Events.READY, function() {

				widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {

					// Somehow needs to know the current time of track being played
					// in the room so that newcomers can seek to that time to match
					// the group.

					// console.log(data);
					// widget.seekTo(startAt);

				})

				widget.bind(SC.Widget.Events.PLAY, function(data) {

					// Somehow needs to know the current time of track being played
					// in the room so that newcomers can seek to that time to match
					// the group.

					// widget.seekTo(startAt);

					widget.getCurrentSound(function(currentSound) {

						// gives us the end time in milliseconds.
						// console.log(currentSound.duration);

						$scope.$apply(function(){

							$scope.ending = currentSound.duration;
							$scope.title = currentSound.title;

						});

					});

				});

				widget.setVolume(100);

				widget.bind(SC.Widget.Events.FINISH, function() {

					// needs to tell the room the rotated sequence for newcomers.
					rotateQueue();

					// unbind the widget from the listeners that we don't need anymore.
					widget.unbind(SC.Widget.Events.READY);
					widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
					widget.unbind(SC.Widget.Events.PLAY);
					widget.unbind(SC.Widget.Events.FINISH);

					// load the widget with the next song on the playlist
					// of the next DJ.
					var currentSong = $scope.currentUser.playlist.shift();

					// rooms may need to have a current song or current dj?
					// may need to emit something to the room so it can keep track
					// for newcomers
					widget.load(currentSong, { show_artwork: true });

					// may need a currentUser and a room's currentDJ
					$scope.currentUser.playlist.push(currentSong);

					updatePlayer();
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

		// HARDCODED
		$scope.currentUser = {
			name: 'justin',
			playlist: ['https://soundcloud.com/blondish/junge-junge-beautiful-girl-preview', 'https://soundcloud.com/purpsoul/harry-wolfman-ontap-waifs-strays-remix', 'https://soundcloud.com/eskimorecordings/nteibint-feat-birsen-riptide']
		}

		var getCurrentSong = function() {
			var currentSong = $scope.currentUser.playlist.shift();
			$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + currentSong );
			$scope.currentUser.playlist.push(currentSong);
		}

		var rotateQueue = function() {
			var oldUser = $scope.room.queue.shift();
			$scope.room.queue.push( oldUser );
			var currentUser = $scope.room.queue[0];
			$scope.currentUser = currentUser;
		}

		$scope.addToQueue = function() {
			if ($scope.room.queue.length === 0) {
				// queue up the 1st song on the user's playlist
				$scope.isFirstSong = true;
				getCurrentSong();
				setUpPlayer();
			}
			// HARDCODED
			$scope.room.queue = [
				{
					username: 'justin',
					playlist: ['https://soundcloud.com/blondish/junge-junge-beautiful-girl-preview', 'https://soundcloud.com/purpsoul/harry-wolfman-ontap-waifs-strays-remix', 'https://soundcloud.com/eskimorecordings/nteibint-feat-birsen-riptide']
				},
				{
					username: 'jason',
					playlist: ['https://soundcloud.com/mixmag-1/premiere-steve-lawler-house-record', 'https://soundcloud.com/kunsthandwerk/khw009-sandro-golia-galatone', 'https://soundcloud.com/fatcat-demo/teso-wo-to-step']
				}
			];
			// emit new user added to the queue
		}

		/**************
		* Room Set-up *
		***************/

		$http.get('http://localhost:1337/rooms/'+$stateParams.roomName)
			.success(function(result) {
				if (!result.message) {
					$scope.room = result;
					// $scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + result.queue[0].source);
					setUpPlayer();
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
