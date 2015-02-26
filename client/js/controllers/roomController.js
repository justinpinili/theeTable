angular.module('theeTable.controllers')
	.controller('roomController', ['$scope', '$state', '$stateParams', '$location', '$sce', 'localStorageService', 'theeTableAuth', 'theeTableRooms', 'theeTableTime', '$modal', function($scope, $state, $stateParams, $location, $sce, localStorageService, theeTableAuth, theeTableRooms, theeTableTime, $modal) {

		/***********************************************************
		 * managePlaylistController allows the user to see what is *
		 * currently on the their playlist.												 *
		 *  																										   *
		 * Allows for: 																						 *
		 *  - Searching on soundcloud for a track									 *
		 *  - Importing playlists/likes from soundcloud						 *
		 *  - Re-ordering, deleting, adding songs on the playlist. *
		 ***********************************************************/

		// socket.io logic for users that are in a room

		$scope.$parent.socket.on('usersInRoom', function(data) {
			$scope.room.users = data.users;
			return;
		});

		$scope.$parent.socket.on('updatedChat', function(data) {
			$scope.room.chat = data.chat;
			$(".chats").animate({ scrollTop: $(document).height() + 1000 }, "slow");
			return;
		});

		$scope.$parent.socket.on('updatedRooms', function(data) {
			$scope.$parent.currentUser.rooms = data.rooms;
			return;
		});

		$scope.$parent.socket.on('rotatedPlaylist', function(data) {
			if ($scope.$parent.currentUser) {
				$scope.$parent.currentUser.playlist = data.playlist;
				$scope.$parent.socket.emit('newQueue', { queue: $scope.room.queue });
			}
			return;
		});

		$scope.$parent.socket.on('updatedPlaylist', function(data) {
			if (!data.error) {
				$scope.$parent.currentUser.playlist = data.playlist;
				if (data.title) {
					$.snackbar({content: "<i class='mdi-av-playlist-add big-icon'></i> " + data.title + " has been added to your playlist." });
				}
				return;
			}
			$.snackbar({content: "<i class='mdi-alert-error big-icon'></i> " + data.error });
			return;
		});

		$scope.$parent.socket.on('updatedQueue', function(data) {
			$scope.room.queue = data.queue;
			if (data.currentDJ) {
				$scope.room.currentDJ = data.currentDJ;
				$scope.room.currentSong = data.currentSong;
				$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + data.currentSong.source).toString();
			}
			return;
		});

		$scope.$parent.socket.on('updatedCurrentTime', function(data) {
			$scope.room.currentTime = data.time;
			return;
		});

		$scope.$parent.socket.on('rotatedQueue', function(data) {
			$scope.room.queue = data.queue;
			$scope.room.currentDJ = data.currentDJ;
			$scope.room.currentSong = data.currentSong;
			$scope.room.currentTime = data.currentTime;

			if (data.currentDJ === $scope.$parent.currentUser.username) {
				$scope.socket = $scope.$parent.socket;
			}
			return;
		});

		$scope.$parent.socket.on('roomUpdate', function(data) {
			$scope.room = data.room;
			if (data.room.currentDJ === null) {
				$scope.currentSong = null;
			}
			return;
		});

		$scope.$parent.socket.on('updatedFavorites', function(data) {
			if (!data.error) {
				$scope.$parent.currentUser.favorites = data.favorites;
				if (data.title) {
					$.snackbar({content: "<i class='mdi-action-favorite big-icon'></i> " + data.title + " has been added to your liked songs" });
				}
				return;
			}
			$.snackbar({content: "<i class='mdi-alert-error big-icon'></i> " + data.error });
			return;
		});

		$scope.$parent.socket.on('updatedRooms', function(data) {
			$scope.$parent.currentUser.rooms = data.rooms;
			return;
		});

		// room initializaton logic

		$scope.room = {};
		$scope.socket = $scope.$parent.socket;
		$scope.newURL;
		$scope.newPlaylist;
		$scope.$parent.userInRoom = true;
		$scope.sound = true;

		var signup = function() {
			var modalInstance = $modal.open({
				templateUrl: './../templates/modals/auth.html',
				controller: 'signupController',
				size: 'lg',
				resolve: {
					userInRoom: function() {
						return $scope.$parent.userInRoom;
					},
					getUserInfo: function() {
						return $scope.$parent.getUserInfo;
					},
					currentSocket: function() {
						return $scope.$parent.socket;
					},
					loginSC: function() {
						return $scope.$parent.loginSC;
					},
					roomName: function() {
						return $stateParams.roomName;
					},
					visitor: function() {
						return $scope.$parent.visitor;
					}
				}
			});
		};

		$scope.managePlaylist = function(roomName) {
			if ($scope.visitor) {
				signup();
				return;
			}
			var modalInstance = $modal.open({
				templateUrl: './../templates/modals/managePlaylist.html',
				controller: 'managePlaylistController',
				size: 'lg',
				resolve: {
					loginSC: function () {
						return $scope.loginSC;
					},
					getSoundcloudID: function() {
						return $scope.getSoundcloudID;
					},
					getSCinstance: function() {
						return $scope.getSCinstance;
					},
					currentDJ: function() {
						return $scope.room.currentDJ;
					},
					username: function() {
						return $scope.$parent.currentUser.username;
					}
				}
			});
		};

		theeTableRooms.getRoomInfo($stateParams.roomName, function(result) {
			$.snackbar({content: "<i class='mdi-file-file-download big-icon'></i> Welcome to " + result.name });
			$scope.room = result;

			if (theeTableAuth.verifyJwt(true)) {
				$scope.$parent.getUserInfo(function(user) {
					$scope.$parent.socket.emit('roomEntered', { roomName: $stateParams.roomName, user: user.username });
				});
			} else {
				$scope.$parent.socket.emit('roomEntered', { roomName: $stateParams.roomName, user: "visitor" });
				$scope.$parent.visitor = true;
			}

			if (result.currentDJ !== null) {
				$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + result.currentSong.source).toString();
			}
			return;
		});

		$scope.$parent.showApp = true;

		// managing playlist is only possible when a user is in a room.
		// this listens for when a new song has been chosen to add to a user's playlist
		// and uses socket.io to update the db with the new entry
		$scope.$watch('newSong', function(newValue, oldValue) {
			if (newValue !== undefined) {
				$scope.$parent.socket.emit('newPlaylistItem', { song: { source: newValue.source, title: newValue.title, artist: newValue.artist, length: newValue.length, soundcloudID: newValue.soundcloudID } });
			}
			return;
		});

		// similar to watching newSong, except checking when an entire playlist
		// is to be overridden.
		// - choosing playlist/likes to replace the user's playlist
		// - removing a song from the user's playlist
		// - re-ordering songs on the user's playlist
		$scope.$watch('newPlaylist', function(newValue, oldValue) {
			if (newValue !== undefined) {
				$scope.$parent.socket.emit('newPlaylist', { playlist: newValue });
			}
			return;
		});

		// room interaction

		// allows a user to save the current song playing to their  likes
		// (if logged into soundcloud, it will like it on soundcloud as well)
		$scope.like = function(song) {
			$scope.$parent.socket.emit('addToLikes', { song: song });
			if ($scope.$parent.getSoundcloudID()) {
				$scope.$parent.likeSongOnSC(song.soundcloudID);
				$.snackbar({content: "<i class='mdi-file-cloud-queue big-icon'></i> " + song.title + " has been added to your soundcloud likes" });
			}
			return;
		}

		// adds current user to the queue
		$scope.addToQueue = function() {
			if ($scope.visitor) {
				signup();
				return;
			}

			if ($scope.$parent.currentUser.playlist.length > 0) {
				$scope.$parent.socket.emit('addToQueue', { user: $scope.$parent.currentUser.username });
				return;
			}
			$.snackbar({content: "<i class='mdi-notification-sms-failed big-icon'></i> Sorry, you must have a song on your playlist to enter the queue" });
			return;
		};

		// allows the current DJ to skip their song if they want to
		$scope.skip = function() {
			$scope.$parent.socket.emit('updatePlaylist', { username: $scope.$parent.currentUser.username });
			return;
		}

		// removes current user from the queue
		$scope.removeFromQueue = function() {
			$scope.$parent.socket.emit('removeFromQueue', { user: $scope.$parent.currentUser.username });
			return;
		};

		// checks to see if the current room is on the user's list of favorite rooms
		$scope.storedInUser = function() {
			if ($scope.room && $scope.$parent.currentUser) {
				if ($scope.$parent.currentUser.rooms.indexOf($scope.room.name) !== -1) {
					return true;
				}
			}
			return false;
		};

		// adds the current room to the user's favorite rooms list
		$scope.addRoom = function() {
			$.snackbar({content: "<i class='mdi-action-grade big-icon'></i> " + $scope.room.name + " has been added to your favorite rooms" });
			$scope.$parent.socket.emit("addRoom", {room: $scope.room.name});
		};

		// checks to see if the current song playing is on the user's list of likes
		$scope.storedInLikes = function() {
			if ($scope.room && $scope.$parent.currentUser) {
				for (var index = 0; index < $scope.$parent.currentUser.favorites.length; index++) {
					if ($scope.$parent.currentUser.favorites[index].soundcloudID === $scope.room.currentSong.soundcloudID) {
						return true;
					}
				}
			}
			return false;
		};

		// displays the correct time when a song is playing
		// (counting down)
		$scope.convertTime = function(duration) {
			return theeTableTime.convertTime(duration);
		};

		$scope.mute = function() {
			$scope.sound = !$scope.sound;
		}

	}]);
