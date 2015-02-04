angular.module('theeTable.controllers')
	.controller('roomController', ['$scope', '$state', '$stateParams', '$location', '$sce', 'localStorageService', 'theeTableAuth', 'theeTableRooms', function($scope, $state, $stateParams, $location, $sce, localStorageService, theeTableAuth, theeTableRooms) {

		/*************
		 * Socket.IO *
		 *************/

		$scope.room = {};

		$scope.$parent.socket.on('usersInRoom', function(data) {
			$scope.room.users = data.users;
		});

		$scope.$parent.socket.on('updatedChat', function(data) {
			$scope.room.chat = data.chat;
			$(".chats").animate({ scrollTop: $(document).height() + 1000 }, "slow");
		});

		$scope.$parent.socket.on('rotatedPlaylist', function(data) {
			$scope.$parent.currentUser.playlist = data.playlist;
			$scope.$parent.socket.emit('newQueue', { queue: $scope.room.queue });
		});

		$scope.$parent.socket.on('updatedPlaylist', function(data) {
			$scope.$parent.currentUser.playlist = data.playlist;
		});

		$scope.$parent.socket.on('updatedQueue', function(data) {
			$scope.room.queue = data.queue;
			if (data.currentDJ) {
				$scope.room.currentDJ = data.currentDJ;
				$scope.room.currentSong = data.currentSong;
				$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + data.currentSong.source).toString();
			}
		});

		$scope.$parent.socket.on('updatedCurrentTime', function(data) {
			$scope.room.currentTime = data.time;
		});

		$scope.$parent.socket.on('rotatedQueue', function(data) {
			$scope.room.queue = data.queue;
			$scope.room.currentDJ = data.currentDJ;
			$scope.room.currentSong = data.currentSong;
			$scope.room.currentTime = data.currentTime;

			if (data.currentDJ === $scope.$parent.currentUser.username) {
				$scope.socket = $scope.$parent.socket;
			}
		});

		$scope.$parent.socket.on('roomUpdate', function(data) {
			$scope.room = data.room;
			if (data.room.currentDJ === null) {
				$scope.currentSong = null;
			}
		});

		$scope.$parent.socket.on('updatedFavorites', function(data) {
			// console.log(data.favorites);
		});

		/**************
		* Room Set-up *
		***************/

		$scope.socket = $scope.$parent.socket;
		$scope.newURL;
		$scope.newPlaylist;

		$scope.$watch('newURL', function(newValue, oldValue) {
			if (newValue !== undefined) {
				$scope.$parent.socket.emit('newPlaylistItem', { playlistItem: { source: newValue.source, title: newValue.title, artist: newValue.artist, length: newValue.length, soundcloudID: newValue.soundcloudID } });
			}
		});

		$scope.$watch('newPlaylist', function(newValue, oldValue) {
			if (newValue !== undefined) {
				$scope.$parent.socket.emit('newPlaylist', { playlist: newValue });
			}
		});

		if (theeTableAuth.verifyJwt()) {
			theeTableRooms.getRoomInfo($stateParams.roomName, function(result) {
				$scope.room = result;
				$scope.$parent.getUserInfo(function(user) {
					$scope.$parent.socket.emit('roomEntered', { roomName: $stateParams.roomName, user: user.username });
				});
				if (result.currentDJ !== null) {
					$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + result.currentSong.source).toString();
				}
				return;
			});
		}

		/*******************
		* Room Interaction *
		********************/

		$scope.like = function(song) {
			console.log("hit");
			$scope.$parent.socket.emit('addToLikes', { song: song });
		}

		$scope.addToQueue = function() {
			$scope.$parent.socket.emit('addToQueue', { user: $scope.$parent.currentUser.username });
		};

		$scope.removeFromQueue = function() {
			$scope.$parent.socket.emit('removeFromQueue', { user: $scope.$parent.currentUser.username });
		};

		$scope.newChatMessage = {};

		$scope.submitMessageDisabled = function() {
			if ($scope.newChatMessage.msg === undefined || $scope.newChatMessage.msg === '') {
				return true;
			}
			return false;
		};

		$scope.submitMessage = function(message) {
			$scope.$parent.socket.emit('newChatMessage', { msg: message });
			$scope.newChatMessage.msg = '';
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
			$scope.$parent.socket.emit('newPlaylistItem', { source: url });
		};
	}]);
