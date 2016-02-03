angular.module('theeTable.controllers')
	.controller('roomController', ['$scope', '$state', '$stateParams', '$location', '$sce', 'localStorageService', 'theeTableAuth', 'theeTableRooms', 'theeTableTime', '$modal', 'theeTableSoundcloud', '$rootScope', function($scope, $state, $stateParams, $location, $sce, localStorageService, theeTableAuth, theeTableRooms, theeTableTime, $modal, theeTableSoundcloud, $rootScope) {

		var snd = new Audio("assets/enter.mp3");
		var snd2 = new Audio("assets/exit.mp3");
		var oldSound = 1;
		var lowered = false;
		var userLikes = null;
		var userSoundcloudPlaylists = null;
		$scope.room = null;

		init();

		///////////////////////////////////////////////////////////////////////////

		// socket.io logic for users that are in a room
		$scope.$parent.socket.on('usersInRoom', function(data) {
			$scope.room.users = data.users;
			return;
		});

		$scope.$parent.socket.on('updatedChat', function(data) {
			$scope.room.chat = data.chat;
			$(".chats").animate({ scrollTop: $(document).height() + 1000 }, "slow");

			if ($scope.room.chat[$scope.room.chat.length -1].user === '') {
				var lastMessage = $scope.room.chat[$scope.room.chat.length - 1].msg.split(" ");
				lastMessage = lastMessage[lastMessage.length -3];
				if (lastMessage === 'entered') {
					snd.play();
					return;
				}
				snd2.play();
			}

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
			$scope.liked = false;

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

		$scope.$parent.socket.on('updatedRooms', function(data) {
			$scope.$parent.currentUser.rooms = data.rooms;
			return;
		});

		// room initializaton logic

		function init() {

			$scope.room = {};
			$scope.socket = $scope.$parent.socket;
			$scope.newURL;
			$scope.newPlaylist;
			$scope.sound = 100;
			$scope.refresh = false;
			$scope.showing = false;

			$scope.$parent.userInRoom = true;
			$scope.$parent.showApp = true;

			theeTableRooms.getRoomInfo($stateParams.roomName)
				.then(function(room) {

					$scope.room = room;

					var previousSession = theeTableAuth.verifyJwt(true);

					if (previousSession) {

						$.snackbar({content:
							"<i class='mdi-file-file-download big-icon'></i> Welcome to "
							+ $scope.room.name });

						$scope.$parent.auth(true);

						$scope.$parent.getUserInfo(function(user) {
							$scope.$parent.socket.emit('roomEntered', {
								roomName: $stateParams.roomName,
								user: user.username });
						});

						setTimeout(function() {
							theeTableSoundcloud.getPlaylists(function(favoriteResults,
								playlistResults) {

								userLikes = favoriteResults;
								userSoundcloudPlaylists = playlistResults;

								$scope.$apply(function() {
									$rootScope.$broadcast('userLikes', userLikes);
									$rootScope.$broadcast('possiblePlaylists', userSoundcloudPlaylists);
								});
							});
						}, 100);

					}

					if ($scope.room.currentDJ !== null) {
						$scope.currentSong = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + $scope.room.currentSong.source).toString();
					}
				});

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

		}

		$scope.setLower = function(closed) {
			if (!closed) {
				oldSound = $scope.sound;
				$scope.sound = 0;
				lowered = true;
				return;
			} else {
				$scope.sound = oldSound;
				lowered = false;
			}
		}

		$scope.managePlaylist = function(roomName) {
			var modalInstance = $modal.open({
				templateUrl: './js/room/managePlaylist.html',
				controller: 'managePlaylistController',
				size: 'lg',
				resolve: {
					loginSC: function () {
						return $scope.$parent.loginSC;
					},
					currentDJ: function() {
						return $scope.room.currentDJ;
					},
					username: function() {
						return $scope.$parent.currentUser.username;
					},
					lower: function() {
						return $scope.setLower;
					},
					inQueue: function() {
						return $scope.room.queue.indexOf($scope.$parent.currentUser.username) > -1;
					},
					userSoundcloudPlaylists: function() {
						return function() {
							return userSoundcloudPlaylists;
						};
					},
					userLikes: function() {
						return function() {
							return userLikes;
						};
					}
				}
			});

			modalInstance.result.then(function () {}, function () {
				$scope.setLower(true);
			});
		};

	}]);
