angular.module('theeTable.controllers')
	.controller('roomController', ['$scope', '$state', '$stateParams', '$location', '$sce', 'localStorageService', 'theeTableAuth', 'theeTableRooms', 'socket', function($scope, $state, $stateParams, $location, $sce, localStorageService, theeTableAuth, theeTableRooms, socket) {

		/*************
		 * Socket.IO *
		 *************/

		$scope.room = {};

		socket.on('usersInRoom', function(data) {
			$scope.room.users = data.users;
		});

		socket.on('updatedChat', function(data) {
			$scope.room.chat = data.chat;
		});

		socket.on('updatedPlaylist', function(data) {
			$scope.$parent.currentUser.playlist = data.playlist;
			socket.emit('newQueue', { queue: $scope.room.queue });
		});

		socket.on('updatedQueue', function(data) {
			$scope.room.queue = data.queue;
			if (data.currentDJ) {
				$scope.room.currentDJ = data.currentDJ;
				$scope.room.currentSong = data.currentSong;
				$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + data.currentSong);
				setUpPlayer();
			}
		});

		socket.on('updatedCurrentTime', function(data) {
			$scope.room.currentTime = data.time;
		});

		socket.on('rotatedQueue', function(data) {
			$scope.room.queue = data.queue;
			$scope.room.currentDJ = data.currentDJ;
			$scope.room.currentSong = data.currentSong;
			$scope.room.currentTime = data.currentTime;
			widget.load($scope.room.currentSong, { show_artwork: true });
			updatePlayer();
		});

		socket.on('roomUpdate', function(data) {
			$scope.room = data;
			if (data.room.currentDJ === null) {
				$scope.currentSong = null;
				widget.load($scope.room.currentSong, { show_artwork: true });
				updatePlayer();
			}
		});

		/********************
		* SoundCloud Player *
		*********************/

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

		/**************
		* Room Set-up *
		***************/

		if (theeTableAuth.verifyJwt()) {
			theeTableRooms.getRoomInfo($stateParams.roomName, function(result) {
				$scope.room = result;
				$scope.$parent.getUserInfo(function(user) {
					socket.emit('roomEntered', { roomName: $stateParams.roomName, user: user.username });
				});
				if (result.currentDJ !== null) {
					$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + result.currentSong);
					// currentTime = result.currentTime;
					setUpPlayer();
				}
				return;
			});
		}

		/*******************
		* Room Interaction *
		********************/

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
			$scope.newChatMessage.msg = '';
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
			$scope.newPlaylistItem.url = '';
			socket.emit('newPlaylistItem', { source: url });
		};
	}]);
