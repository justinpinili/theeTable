angular.module('theeTable.controllers')
	.controller('roomController', function($scope, $state, $http, $stateParams, $location, $sce) {

		/*************
		 * Socket.IO *
		 *************/
		var socket = io.connect();

		socket.emit('roomEntered', { room: $stateParams.roomName, user: Date.now()});

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

		socket.on('updatedQueue', function(data) {
			$scope.$apply(function() {
				$scope.room.queue = data.queue;
			})
		});

		/*************
		* SoundCloud *
		**************/

		var widgetIframe;
		var widget;

		var updatePlayer = function() {
			widget.bind(SC.Widget.Events.READY, function() {

				widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
					// console.log(data);
					// widget.seekTo(startAt);
				})

				widget.bind(SC.Widget.Events.PLAY, function(d) {
					// get information about currently playing sound
					// widget.seekTo(startAt);
					widget.getCurrentSound(function(currentSound) {
						console.log(currentSound.duration);
						$scope.$apply(function(){
							$scope.ending = currentSound.duration;
							$scope.title = currentSound.title;
						});
					});
				});

				widget.setVolume(100);
				// get the value of the current position

				widget.bind(SC.Widget.Events.FINISH, function() {
					rotateQueue();
					var currentSong = $scope.currentUser.playlist.shift();

					widget.unbind(SC.Widget.Events.READY);
					widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
					widget.unbind(SC.Widget.Events.PLAY);
					widget.unbind(SC.Widget.Events.FINISH);

					widget.load(currentSong, {
						show_artwork: true
					});
					$scope.currentUser.playlist.push(currentSong);
					updatePlayer();
				});

				widget.play();
			});
		};

		var setUpPlayer = function(currentTime) {
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
					name: 'justin',
					playlist: ['https://soundcloud.com/blondish/junge-junge-beautiful-girl-preview', 'https://soundcloud.com/purpsoul/harry-wolfman-ontap-waifs-strays-remix', 'https://soundcloud.com/eskimorecordings/nteibint-feat-birsen-riptide']
				},
				{
					name: 'jason',
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
