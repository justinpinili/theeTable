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

		socket.on('rotatedPlaylist', function(data) {
			$scope.$parent.currentUser.playlist = data.playlist;
			socket.emit('newQueue', { queue: $scope.room.queue });
		});

		socket.on('updatedPlaylist', function(data) {
			$scope.$parent.currentUser.playlist = data.playlist;
		});

		socket.on('updatedQueue', function(data) {
			$scope.room.queue = data.queue;
			if (data.currentDJ) {
				$scope.room.currentDJ = data.currentDJ;
				$scope.room.currentSong = data.currentSong;
				$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + data.currentSong);
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

			if (data.currentDJ === $scope.$parent.currentUser.username) {
				$scope.socket = socket;
			}
		});

		socket.on('roomUpdate', function(data) {
			$scope.room = data;
			if (data.room.currentDJ === null) {
				$scope.currentSong = null;
			}
		});

		/**************
		* Room Set-up *
		***************/

		$scope.socket = socket;
		$scope.newURL;
		$scope.newPlaylist;

		$scope.$watch('newURL', function(newValue, oldValue) {
			socket.emit('newPlaylistItem', { source: newValue });
		});

		$scope.$watch('newPlaylist', function(newValue, oldValue) {
			socket.emit('newPlaylist', { playlist: newValue });
		});

		if (theeTableAuth.verifyJwt()) {
			theeTableRooms.getRoomInfo($stateParams.roomName, function(result) {
				$scope.room = result;
				$scope.$parent.getUserInfo(function(user) {
					socket.emit('roomEntered', { roomName: $stateParams.roomName, user: user.username });
				});
				if (result.currentDJ !== null) {
					$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + result.currentSong);
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
