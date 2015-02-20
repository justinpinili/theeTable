angular.module('theeTable', [
  'ui.router',
  'theeTable.controllers',
  'LocalStorageModule',
  'theeTable.services',
  'theeTable.directives',
  'ui.bootstrap',
  'ui.sortable'
])
  .config(['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider', function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('theeTable');

    $stateProvider
      .state('home', {
        url: '/home',
        controller: ['$scope', function($scope) {
          $scope.$parent.showApp = false;
        }],
        templateUrl: 'templates/app.html'
      })
      .state('rooms', {
        url: '/rooms',
        controller: 'roomsController',
        templateUrl: 'templates/controllers/rooms.html'
      })
      .state('room', {
        url: '/rooms/:roomName',
        controller: 'roomController',
        templateUrl: 'templates/controllers/room.html',
        onEnter: ['theeTableSocket', function(theeTableSocket){
          theeTableSocket.connect();
        }],
        onExit: ['theeTableSocket', function(theeTableSocket){
          theeTableSocket.disconnect();
        }]
      })
      .state('logout', {
        url: '/logout',
        controller: ['localStorageService', '$location', '$scope', function(localStorageService, $location, $scope) {
          localStorageService.remove('jwt');
          $scope.$parent.showApp = false;
          $scope.$parent.currentUser = undefined;
          $scope.$parent.soundcloudID = undefined;
          if ($scope.$parent.loggedout) {
            $.snackbar({ content: "<i class='mdi-alert-error big-icon'></i> You have logged into Thee Table from another source. Good-bye!",
                         timeout: 10000});
            delete $scope.$parent.loggedout;
          } else {
            $.snackbar({ content: "<i class='mdi-file-file-upload big-icon'></i> You have successfully logged out of Thee Table. Good-bye!",
                         timeout: 10000});
          }
          $location.path("/");
        }]
      });

      $urlRouterProvider.otherwise('/home');
  }]);

angular.module('theeTable.controllers', []);
angular.module('theeTable.services', []);
angular.module('theeTable.directives', []);

angular.module('theeTable.controllers')
	.controller('authController', ['$scope', '$location', 'localStorageService', 'theeTableAuth', 'theeTableUrl', 'userInRoom', '$modalInstance', 'getUserInfo', 'currentSocket', 'loginSC', function($scope, $location, localStorageService, theeTableAuth, theeTableUrl, userInRoom, $modalInstance, getUserInfo, currentSocket, loginSC) {

		/**********************************
		 * main login to access theeTable *
		 *  - users can sign up / log in  *
		 *  - log in with soundcloud      *
		 **********************************/

		$scope.current = 'login';
		$scope.url = theeTableUrl.getUrl() + '/user/login';
		$scope.prompt = {};
		$scope.prompt.username = 'Enter your username.';
		$scope.prompt.password = 'Enter your password.';

		userInRoom = false;

		// Displays proper prompts for either a new user or an existing user trying to log in
		$scope.switchForm = function() {
			if ($scope.current === 'login') {
				$scope.current = 'new';
				$scope.prompt.username = 'Choose a new username.';
				$scope.prompt.password = 'Choose a new password.';
			} else {
				$scope.current = 'login';
				$scope.prompt.username = 'Enter your username.';
				$scope.prompt.password = 'Enter your password.';
			}
			$scope.url = ""+ theeTableUrl.getUrl() + '/user/' + $scope.current;
			return;
		};

		// Authorize with user typed information
		$scope.auth = function(inputUsername, inputPassword) {
			theeTableAuth.siteAccess($scope.url, inputUsername, inputPassword, function(result) {
				if (!result.message) {

					localStorageService.set("jwt", result.jwt);

					getUserInfo(function(retrievedUser) {

						// let socket.io know the user's name
						currentSocket.emit("userName", {username: retrievedUser.username});

						$scope.$parent.showApp = true;
						$modalInstance.close();

						// transfer to rooms lobby
						$location.path("/rooms");
						return;
					});
					return;
				}

				$scope.message = result.message;
				$scope.login.password = '';
				return;
			});
		};

		// Authorize using soundcloud
		$scope.authSC = function() {

			var theeTableDB = function(endpoint, isNew, username) {

				// Attempt to login to theeTable with soundcloud credentials
				theeTableAuth.siteAccess(""+ theeTableUrl.getUrl() + endpoint, username, 'abc', function(result) {
					if (!result.message) {
						localStorageService.set("jwt", result.jwt);
						getUserInfo(function(retrievedUser) {
							currentSocket.emit("userName", {username: retrievedUser.username});

							$scope.$parent.showApp = true;
							$modalInstance.close();

							$location.path("/rooms");
							return;
						});
						return;
					}

					if (isNew) {
						// If the user does not exist, sign the user up with soundcloud credentials
						theeTableDB('/user/new', false, username);
						return;
					}

					$scope.message = result.message;
					$scope.login.password = '';
					return;
				});
			};

			loginSC(function(soundcloudID) {
				// Once the user is verified with soundcloud, pass that information to the DB
				theeTableDB('/user/login', true, soundcloudID.username);
			});

		};

		// prevents users from entering empty form inputs
		$scope.login = {};
		$scope.authDisabled = function() {
			if ($scope.login.username === undefined ||
			    $scope.login.password === undefined ||
					$scope.login.username === '' ||
					$scope.login.password === '') {
						return true;
					}
			return false;
		};

		$scope.closeModal = function() {
			$modalInstance.close();
			return;
		}

	}]);

angular.module('theeTable.controllers')
.controller('createRoomController', ['$scope', '$modalInstance', 'currentSocket', 'theeTableRooms', function($scope, $modalInstance, currentSocket, theeTableRooms) {

	/************************************************************
	 * createRoomController handles room creation               *
	 ************************************************************/

	// closes modal
	$scope.closeModal = function() {
		$modalInstance.close();
	};

	$scope.room = {};

	// notify the DB of the user's new room name
	$scope.create = function(newValue) {

		newValue = newValue || $('#room-name').val();

		if (newValue === '' || newValue === undefined) {
			$scope.message = 'Your new room cannot have a blank name.';
			return;
		}

		theeTableRooms.createRoom(newValue, function(result) {
			if (!result.message) {
				currentSocket.emit("addRoom", {room: result.name});
				$modalInstance.close();
				return;
			}

			$scope.message = result.message;
			return;
		});

		$scope.room.value = '';
		$('#room-name').val('');

		return;
	};

}]);

angular.module('theeTable.controllers')
  .controller('mainController', ['$scope', 'localStorageService', 'theeTableAuth', '$modal', 'theeTableSocket', 'theeTableSoundcloud', 'theeTableUrl', '$location', function($scope, localStorageService, theeTableAuth, $modal, theeTableSocket, theeTableSoundcloud, theeTableUrl, $location) {

    /************************************************************
     * mainController that holds the current user's information *
     * and allows that information to be passed across the      *
     * application.                                             *
     *                                                          *
     *  - Playlist                                              *
     *  - Favorites                                             *
     *  - Favorite Rooms                                        *
     *  - soundcloud instance for theeTable application         *
     ************************************************************/

    // initialize client with app credentials
    var scInit = SC.initialize({
      client_id: theeTableUrl.getID(),
      redirect_uri: '' + theeTableUrl.getUrl() + '/success'
    });

    $scope.sc = theeTableSoundcloud.setSCinstance(scInit);

    $scope.socket = theeTableSocket;

    $scope.socket.on("signOn", function(data) {
      if ($scope.currentUser) {
        if (data.username === $scope.currentUser.username &&
            data.loginTime !== $scope.currentUser.loginTime) {
            $scope.loggedout = true;
            $location.path('/logout');
          }
      }
    });

    $scope.inRoom = function() {
      if ($scope.userInRoom) {
        return true;
      }
      return false;
    };

    $scope.getUserInfo = function(callback) {
      theeTableAuth.getUserInfo(function(result) {
        if (!result.message) {
          $scope.currentUser = result;
          if (callback) {
            callback(result);
          }
          return;
        }
        return;
      });
    };

    // Information is shown in a
    // modal with it's own controller and
    // template - manage and view are prefixed

    $scope.credits = function() {
      var modalInstance = $modal.open({
        templateUrl: './../templates/modals/credits.html',
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
          $scope.closeModal = function() {
            $modalInstance.close();
          }
        }],
        size: 'sm'
      });
    }

    $scope.auth = function() {
      if (theeTableAuth.verifyJwt(true)) {
        $scope.showApp = true;
        $location.path('/rooms');
        return;
      }

      var modalInstance = $modal.open({
        templateUrl: './../templates/modals/auth.html',
        controller: 'authController',
        size: 'lg',
        resolve: {
          userInRoom: function() {
            return $scope.userInRoom;
          },
          getUserInfo: function() {
            return $scope.getUserInfo;
          },
          currentSocket: function() {
            return $scope.socket;
          },
          loginSC: function() {
            return $scope.loginSC;
          }
        }
      });
    }

    $scope.viewFavorites = function() {
      var modalInstance = $modal.open({
        templateUrl: './../templates/modals/viewFavorites.html',
        controller: 'viewFavoritesController',
        size: 'lg',
        resolve: {
          currentSocket: function () {
            return $scope.socket;
          }
        }
      });
    };

    $scope.viewFavoriteRooms = function() {
      var modalInstance = $modal.open({
        templateUrl: './../templates/modals/viewFavoriteRooms.html',
        controller: 'viewFavoriteRoomsController',
        size: 'lg',
        resolve: {
          currentSocket: function () {
            return $scope.socket;
          }
        }
      });
    };

    // mainController holds the soundcloud instance so it can be used
    // throughout the app

    $scope.getSoundcloudID = function() {
      return theeTableSoundcloud.getSoundcloudID();
    };

    $scope.getSCinstance = function() {
      return theeTableSoundcloud.getSCinstance();
    };

    $scope.loginSC = function(callback) {
      theeTableSoundcloud.loginSC(function() {
        $scope.$apply(function() {
          $scope.soundcloudID = theeTableSoundcloud.getSoundcloudID();
        });

        if (callback) {
          callback($scope.soundcloudID);
        }
        return;
      });
      return;
    };

    $scope.likeSongOnSC = function(id) {
      theeTableSoundcloud.like(id);
      return;
    };

  }]);

angular.module('theeTable.controllers')
.controller('managePlaylistController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', 'loginSC', 'getSoundcloudID', 'getSCinstance','theeTableTime', 'theeTableSoundcloud', function($scope, $modalInstance, $modal, theeTableAuth, loginSC, getSoundcloudID, getSCinstance, theeTableTime, theeTableSoundcloud) {

	/***********************************************************
	 * managePlaylistController allows the user to see what is *
	 * currently on the their playlist.												 *
	 *  																											 *
	 * Allows for: 																						 *
	 *  - Searching on soundcloud for a track									 *
	 *  - Importing playlists/likes from soundcloud						 *
	 *  - Re-ordering, deleting, adding songs on the playlist. *
	 ***********************************************************/

	$scope.playlist = [];

	theeTableAuth.getUserInfo(function(user) {
		$scope.playlist = user.playlist;
	});

	// clear the scoped arrays of un-needed properties
	var songsForDB = function(collection) {
		var songCollection = [];
		for (var index = 0; index < collection.length; index++) {
			songCollection.push({ source: collection[index].source || collection[index].permalink_url, title: collection[index].title,
				artist: collection[index].artist || collection[index].user.username,
				length: collection[index].length || collection[index].duration,
				soundcloudID: collection[index].soundcloudID || collection[index].id
			});
		}
		return songCollection;
	}

	// searching soundcloud lives in its own modal
	$scope.searchSC = function() {
		var modalInstance = $modal.open({
			templateUrl: './../templates/modals/search.html',
			controller: 'searchController',
			size: 'lg',
			resolve: {
				playlist: function () {
					return $scope.playlist;
				},
				getSCinstance: function() {
					return getSCinstance;
				}
			}
		});
	}

	// allows for re-ordering playlist
	$scope.sortableOptions = {
		stop: function(e, ui) {
			$.snackbar({content: "<i class='mdi-editor-format-list-numbered big-icon'></i> Your playlist order has beeen updated." });
			$scope.$parent.newPlaylist = songsForDB($scope.playlist);
		}
	};

	// removes an entry from the playlist
	$scope.remove = function(index) {
		$.snackbar({content: "<span class='glyphicon glyphicon-trash big-icon'></span> " + $scope.playlist[index].title + " has been removed from your playlist." });
		$scope.playlist.splice(index, 1);
		$scope.$parent.newPlaylist = songsForDB($scope.playlist);
	}

	// displays proper time info for each song on the playlist
	$scope.convertTime = function(duration) {
		return theeTableTime.convertTime(duration);
	};

	// if the user has a soundcloud account, connect to it and retrieve
	// playlists and likes so that the user can import those songs
	$scope.connectSC = function() {

		var getPlaylists = function() {

			$scope.possiblePlaylists = 'start';

			theeTableSoundcloud.getPlaylists(function(favoriteResults, playlistResults) {
				$scope.$apply(function() {
					$scope.likes = favoriteResults;
					$scope.possiblePlaylists = playlistResults;
				});
			});

		};

		if (getSoundcloudID().id === undefined) {
			loginSC(function() {
				$scope.$apply(function() {
					getPlaylists();
				});
			});
		} else {
			getPlaylists();
		}

	};

	// Sets the chosen playlist as the user's new playlist
	// currently over-rides all entries.
	$scope.importPlaylist = function(playlist, likes) {
		var importedPlaylist = [];

		if (likes === 'likes') {
			$scope.$parent.newPlaylist = songsForDB($scope.likes);
		} else {
			$scope.$parent.newPlaylist = songsForDB(playlist.tracks);
		}

		$scope.playlist = $scope.$parent.newPlaylist;
		delete $scope.possiblePlaylists;
	}

	// close modal
	$scope.close = function() {
		$modalInstance.close();
	}

}]);

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
		$scope.visitor;

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
				$scope.visitor = true;
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

	}]);

angular.module('theeTable.controllers')
	.controller('roomsController', ['$scope', '$location', 'localStorageService', 'theeTableAuth', 'theeTableRooms', '$modal', function($scope, $location, localStorageService, theeTableAuth, theeTableRooms, $modal) {

		/***********************************************************
		 * roomsController allows the user to see what             *
		 * rooms are currently available on Thee Table   					 *
		 *  																										   *
		 * Allows for: 																						 *
		 *  - Creating a new room									                 *
		 *  - navigating to an existing room						           *
		 ***********************************************************/

		// rooms initialization logic

		$scope.rooms = [];
		$scope.roomSearch = {};
		$scope.$parent.userInRoom = false;

		$scope.$parent.showApp = true;

		theeTableRooms.getAllRooms(function(result) {
			$scope.rooms = result.rooms;

			if (theeTableAuth.verifyJwt(true)) {
				$scope.$parent.getUserInfo();
				$scope.$parent.showApp = true;
				$scope.favoriteRooms = [];

				theeTableAuth.getUserInfo(function(user) {
					$scope.favoriteRooms = user.rooms;
				});
			} else {
				$scope.visitor = true;
			}

		});

		// routes the user to the correct room
		$scope.navigate = function(roomName) {
			$location.path('/rooms/'+roomName);
		};

		// allows the user to create a new room
		// in it's own modal
		$scope.createRoom = function() {
			var modalInstance = $modal.open({
				templateUrl: './../templates/modals/createRoom.html',
				controller: 'createRoomController',
				size: 'lg',
				resolve: {
					currentSocket: function () {
						return $scope.$parent.socket;
					}
				}
			});
		};

		// removes an entry from the rooms list
		$scope.remove = function(index) {
			$.snackbar({content: "<span class='glyphicon glyphicon-trash big-icon'></span> " + $scope.favoriteRooms[index] + " has been removed to your favorite rooms list" });
			$scope.favoriteRooms.splice(index, 1);
			var rooms = [];
			for (var index = 0; index < $scope.favoriteRooms.length; index++) {
				rooms.push($scope.favoriteRooms[index]);
			}
			$scope.$parent.socket.emit('newRooms', { rooms: rooms });
		}

	}]);

angular.module('theeTable.controllers')
.controller('searchController', ['$scope', '$modalInstance', '$modal', 'playlist', 'getSCinstance', 'theeTableSoundcloud', 'theeTableTime', function($scope, $modalInstance, $modal, playlist, getSCinstance, theeTableSoundcloud, theeTableTime) {

	/************************************************************
	 * searchController allows the user to search on soundcloud *
	 * and can add results to their playlist   					        *
	 ************************************************************/

	$scope.soundcloud = {};

	// search soundcloud
	$scope.search = function(query) {

		$scope.soundcloud.results = [];
		$scope.searching = true;

		query = $('#soundcloudSearch').val();

		theeTableSoundcloud.searchTracks(query, function(tracks) {
			$scope.searching = false;

			$scope.$apply(function() {
				$scope.soundcloud.results = tracks;
			});
		});

		$scope.soundcloud.query = '';
		$('#soundcloudSearch').val('');

		return;
	};

	// display proper time
	$scope.convertTime = function(duration) {
		return theeTableTime.convertTime(duration);
	};

	// adds chosen song to the playlist
	// also remove's the from the search results
	$scope.addSongToPlaylist = function(url, title, artist, length, id, index) {
		$scope.soundcloud.results.splice(index,1);
		$scope.$parent.newSong = { source: url, title: title, artist: artist, length: length, soundcloudID: id };
		playlist.push({ source: url, title: title, artist: artist, length: length, soundcloudID: id });
		return;
	};

	// close modal
	$scope.close = function() {
		$modalInstance.close();
	}

}]);

angular.module('theeTable.controllers')
.controller('signupController', ['$scope', '$location', 'localStorageService', 'theeTableAuth', 'theeTableUrl', 'userInRoom', '$modalInstance', 'getUserInfo', 'currentSocket', 'loginSC', 'roomName', function($scope, $location, localStorageService, theeTableAuth, theeTableUrl, userInRoom, $modalInstance, getUserInfo, currentSocket, loginSC, roomName) {

	/**********************************
	* main login to access theeTable *
	*  - users can sign up / log in  *
	*  - log in with soundcloud      *
	**********************************/

	$scope.current = 'new';
	$scope.url = theeTableUrl.getUrl() + '/user/new';
	$scope.prompt = {};
	$scope.prompt.username = 'Choose a new username.';
	$scope.prompt.password = 'Choose a new password.';

	userInRoom = false;

	$scope.signupController = true;

	// Authorize with user typed information
	$scope.auth = function(inputUsername, inputPassword) {
		theeTableAuth.siteAccess($scope.url, inputUsername, inputPassword, function(result) {
			if (!result.message) {

				localStorageService.set("jwt", result.jwt);

				getUserInfo(function(retrievedUser) {

					// let socket.io know the user's name
					currentSocket.emit("userName", {username: retrievedUser.username});

					$scope.$parent.showApp = true;
					$modalInstance.close();

					// transfer to rooms lobby
					$location.path("/rooms");
					return;
				});
				return;
			}

			$scope.message = result.message;
			$scope.login.password = '';
			return;
		});
	};

	// Authorize using soundcloud
	$scope.authSC = function() {

		var theeTableDB = function(endpoint, isNew, username) {

			// Attempt to login to theeTable with soundcloud credentials
			theeTableAuth.siteAccess(""+ theeTableUrl.getUrl() + endpoint, username, 'abc', function(result) {
				if (!result.message) {
					localStorageService.set("jwt", result.jwt);
					getUserInfo(function(retrievedUser) {
						currentSocket.emit("userName", {username: retrievedUser.username});

						$scope.$parent.showApp = true;
						$modalInstance.close();

						$location.path("/rooms");
						return;
					});
					return;
				}

				if (isNew) {
					// If the user does not exist, sign the user up with soundcloud credentials
					theeTableDB('/user/new', false, username);
					return;
				}

				$scope.message = result.message;
				$scope.login.password = '';
				return;
			});
		};

		loginSC(function(soundcloudID) {
			// Once the user is verified with soundcloud, pass that information to the DB
			theeTableDB('/user/login', true, soundcloudID.username);
		});

	};

	// prevents users from entering empty form inputs
	$scope.login = {};
	$scope.authDisabled = function() {
		if ($scope.login.username === undefined ||
			$scope.login.password === undefined ||
			$scope.login.username === '' ||
			$scope.login.password === '') {
				return true;
			}
			return false;
		};

	$scope.closeModal = function() {
		$modalInstance.close();
		return;
	};

	}]);

angular.module('theeTable.controllers')
.controller('viewFavoriteRoomsController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', '$location', 'currentSocket', function($scope, $modalInstance, $modal, theeTableAuth, $location, currentSocket) {

	/************************************************************
	 * viewFavoriteRoomsController allows the user to see what  *
	 * rooms are on the their favorite room's list.							*
	 * 																													*
	 * users can navigate directly from this page as well       *
	 ************************************************************/

	// modal initialiazation logic

	$scope.rooms = [];

	theeTableAuth.getUserInfo(function(user) {
		$scope.rooms = user.rooms;
	});

	// removes an entry from the rooms list
	$scope.remove = function(index) {
		$.snackbar({content: "<span class='glyphicon glyphicon-trash big-icon'></span> " + $scope.rooms[index] + " has been removed to your favorite rooms list" });
		$scope.rooms.splice(index, 1);
		var rooms = [];
		for (var index = 0; index < $scope.rooms.length; index++) {
			rooms.push($scope.rooms[index]);
		}
		currentSocket.emit('newRooms', { rooms: rooms });
	}

	// routes the current user to the chosen room
	$scope.navigate = function(roomName) {
		$location.path('/rooms/'+roomName);
		$modalInstance.close();
	};

	// closes modal
	$scope.close = function() {
		$modalInstance.close();
	}
}]);

angular.module('theeTable.controllers')
.controller('viewFavoritesController', ['$scope', '$modalInstance', '$modal', 'theeTableAuth', 'currentSocket', 'theeTableTime', function($scope, $modalInstance, $modal, theeTableAuth, currentSocket, theeTableTime) {

	/************************************************************
	 * viewFavoritesController allows the user to see what      *
	 * songs are on the their favorite's list.						    	*
	 * 																													*
	 * users can navigate remove the song and add a favorite to *
	 * their playlist.                                          *
	 ************************************************************/

	// modal initialization logic

	$scope.favorites = [];

	theeTableAuth.getUserInfo(function(user) {
		$scope.favorites = user.favorites;
	});

	// re-order the songs on the favorites list
	$scope.sortableOptions = {
		stop: function(e, ui) {
			var favorites = [];
			for (var index = 0; index < $scope.favorites.length; index++) {
				favorites.push({ source: $scope.favorites[index].source, title: $scope.favorites[index].title, artist: $scope.favorites[index].artist, length: $scope.favorites[index].length, soundcloudID: $scope.favorites[index].soundcloudID });
			}
			currentSocket.emit('newFavorites', { favorites: favorites });
		}
	};

	// remove a song from the favorites list
	$scope.remove = function(index) {
		$.snackbar({content: "<span class='glyphicon glyphicon-trash big-icon'></span> " + $scope.favorites[index].title + " has been removed to your liked songs" });
		$scope.favorites.splice(index, 1);
		var favorites = [];
		for (var index = 0; index < $scope.favorites.length; index++) {
			favorites.push({ source: $scope.favorites[index].source, title: $scope.favorites[index].title, artist: $scope.favorites[index].artist, length: $scope.favorites[index].length, soundcloudID: $scope.favorites[index].soundcloudID });
		}
		currentSocket.emit('newFavorites', { favorites: favorites });
	}

	// adds a favorite to the user's playlist
	$scope.addToPlaylist = function(song) {
		song = { source: song.source, title: song.title, artist: song.artist, length: song.length, soundcloudID: song.soundcloudID };
		currentSocket.emit('newPlaylistItem', { song: song });
	}

	// converts the time into hours, minutes, seconds
	$scope.convertTime = function(duration) {
		return theeTableTime.convertTime(duration);
	};

	// close modal
	$scope.close = function() {
		$modalInstance.close();
	}

}]);

angular.module('theeTable.directives')
.directive('customInputBox', [function() {

	/************************************************************
	 * customInputBox directive renders an input box with error *
	 * div. it controls the logic after a user submits an input	*
	 * 																													*
	 * used for chat messages              *
	 ************************************************************/

	return {
		restrict: 'E',
		templateUrl: './../../templates/directives/inputDirective.html',
		scope: {
			socket: '=',
			input: '@'
		},
		controller: ['$scope', 'theeTableRooms', function($scope, theeTableRooms) {

			// initialization logic

			$scope.newInput = {};

			// disables submission if it's empty
			$scope.createDisabled = function() {
				if ($scope.newInput.value === undefined || $scope.newInput.value === '') {
					return true;
				}
				return false;
			};

			// notify the DB of the user's input
			$scope.create = function(newValue) {
				$scope.socket.emit('newChatMessage', { msg: newValue })
				$scope.newInput.value = '';
				return;
			};

		}],
		link: function(scope, element, attrs) {

			$(document).ready(function() {
				setTimeout(function() {
					$.material.init();
				}, 0);
			});
		}
	}
}]);

angular.module('theeTable.directives')
	.directive('soundCloudPlayer', [function() {

		/************************************************************
		 * soundCloudPlayer directive renders the soundcloud API    *
		 * widget and controls all the behavior associated with the	*
		 * player.                                                	*
		 *                                                          *
		 * Current Song                                             *
		 * Current Time (updated frequently)                        *
		 * Current DJ                                               *
		 * Queue Rotation                                           *
		 * Update Current DJ's playlist                             *
		 ************************************************************/

		return {
			restrict: 'E',
			template: '<iframe id="sc-widget" src="{{ thisSong }}" width="100%" height="98%" scrolling="no" frameborder="no"></iframe>',
			scope: {
				socket: '=',
				currentSong: '=',
				room: '=',
				username: '=',
				title: '='
			},
			controller: ['$scope', '$sce', function($scope, $sce) {

				var widgetIframe;
				var widget;
				var currentTime;

				var unbind = function() {
					widget.unbind(SC.Widget.Events.READY);
					widget.unbind(SC.Widget.Events.PLAY_PROGRESS);
					widget.unbind(SC.Widget.Events.PLAY);
					widget.unbind(SC.Widget.Events.FINISH);
				}

				$scope.thisSong = '';

				// makes sure that the url is safe to load into the soundcloud api widget
				$scope.sce = function(value) {
					return $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=' + value);
				}

				// logic that is set up each time a new song is ready to play
				// prepares the soundcloud api widget
				$scope.updatePlayer = function(newSong) {
					if (newSong) {
						widget.load(newSong, { show_artwork: true });
					}

					// Bind the events with the SoundCloud widget
					widget.bind(SC.Widget.Events.READY, function() {
						widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
							// should only emit from currentDJ
							if ($scope.room.currentDJ === $scope.username) {
								$scope.socket.emit('currentTime', { time: data.currentPosition });
							}
						});
						widget.bind(SC.Widget.Events.PLAY, function(data) {

							// if the client is new and a song is playing, skip to the current time
							if ($scope.room.currentTime !== null) {
								widget.seekTo($scope.room.currentTime);
							}

							// if a song is playing, configure the title, otherwise, unbind the widget
							// since it's not being used
							if ($scope.room.currentSong) {
								widget.getCurrentSound(function(currentSound) {
									$scope.$apply(function(){
										$scope.title = currentSound.title;
									});
								});
							} else {
								delete $scope.title;
								widget.seekTo($scope.oldValue.length);
								unbind();
								return;
							}

						});

						widget.setVolume(100);

						//once a song is finished
						widget.bind(SC.Widget.Events.FINISH, function() {

							// unbind the widget from the listeners that we don't need anymore.
							unbind();

							if ($scope.room.currentDJ === $scope.username) {
								$scope.socket.emit('updatePlaylist', { username: $scope.username });
							}
						});

						widget.play();

					});
				};

				$scope.setUpPlayer = function() {
					// the DOM element needs to exist before it can be identified
					setTimeout(function(){
						widgetIframe = document.getElementById('sc-widget');
						widget       = SC.Widget(widgetIframe);
						$scope.updatePlayer();
					}, 500);
				};

			}],
			link: function(scope, element, attrs) {
				var first = true;

				// set up a watcher so that we can update the player once a new song is configured
				scope.$watch('currentSong', function(newValue, oldValue) {
					if (!first && newValue === null) {
						scope.oldValue = oldValue;
						delete scope.title;
						scope.updatePlayer('');
					}

					if (newValue !== undefined) {
						if (newValue !== null) {
							if (first) {
								scope.thisSong = scope.sce(newValue.source);
								scope.setUpPlayer();
								first = false;
							} else {
								delete scope.title;
								scope.updatePlayer(newValue.source);
							}
						}
					}
				});

			}
		}
	}]);

angular.module('theeTable.services')
	.factory('theeTableAuth', ['$http', 'localStorageService', '$location', 'theeTableUrl', function($http, localStorageService, $location, theeTableUrl) {

		/************************************************************
		 * theeTableAuth retrieves information from the DB for a    *
		 * user.                                                  	*
		 *                                                          *
		 * Login / Sign Up                                          *
		 * Obtain user information                                  *
		 * verify JWT                                               *
		 ************************************************************/

		// Login or Signup
		var siteAccess = function(url, username, password, callback) {
			$http.post(url, {username: username, password: password})
				.success(function(result) {
					callback(result);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				})
		};

		// Obtain user information
		var getUserInfo = function(callback) {
			var jwt = localStorageService.get("jwt");
			$http.get("" + theeTableUrl.getUrl() + '/user?jwt_token='+jwt)
				.success(function(result) {
					callback(result);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		};

		// Verify JWT
		var verifyJwt = function(redirect) {
			var jwt = localStorageService.get("jwt");
			if (!jwt) {
				if (!redirect) {
					alert("you must be logged in to access Thee Table.");
					$location.path("/main");
				}
				return false;
			} else {
				return true;
			}
		};

		return {
			siteAccess: siteAccess,
			getUserInfo: getUserInfo,
			verifyJwt: verifyJwt
		};
	}]);

angular.module('theeTable.services')
	.factory('theeTableRooms', ['$http', 'localStorageService', '$location', 'theeTableUrl', function($http, localStorageService, $location, theeTableUrl) {

		/************************************************************
		 * theeTableRooms obtains all room information used in the  *
		 * application.                                            	*
		 *                                                          *
		 * Obtain all rooms                                         *
		 * Create a new room                                        *
		 * Obtain a single room's information                       *
		 ************************************************************/

		var jwt = localStorageService.get("jwt");

		// Obtain all rooms
		var getAllRooms = function(callback) {
			$http.get("" + theeTableUrl.getUrl() + '/rooms')
				.success(function(result) {
					callback(result);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		};

		// Create a new room
		var createRoom = function(roomName, callback) {
			$http.post("" + theeTableUrl.getUrl() + '/rooms?jwt_token='+jwt, {name: roomName})
				.success(function(result) {
					if (!result.message) {
						callback(result);
						// transfer to rooms lobby
						$location.path("/rooms/"+result.name);
						return;
					}
					callback(result);
					return;
				})
				.error(function(error) {
					console.log(error);
					return;
				});
		};

		// Get a specific room's information
		var getRoomInfo = function(roomName, callback) {

			if (roomName === '') {
				$location.path("/rooms");
				return;
			}

			$http.get("" + theeTableUrl.getUrl() + '/rooms/'+roomName)
				.success(function(result) {
					if (!result.message) {
						callback(result);
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
		};

		return {
			getAllRooms: getAllRooms,
			createRoom: createRoom,
			getRoomInfo: getRoomInfo
		};
	}]);

angular.module('theeTable.services')
	.factory('theeTableSocket', ['$rootScope', function($rootScope) {

		/************************************************************
		 * socket factory creates a socket.io connection and have   *
		 * two primary functions.                                  	*
		 *                                                          *
		 * On (listener for events)                                 *
		 * Emit (sends an event)                                    *
		 ************************************************************/

		// connect to socket.io
		var socket = io.connect();
		var disconnected = false;

		// listen for an event, and apply the callback to the rootscope
		var on = function(eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		};

		// send an event and apply the callback to the rootscope
		var emit = function(eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		};

		var connect = function() {
			if (disconnected) {
				socket.connect();
				disconnected = false;
			}
		}

		var disconnect = function() {
			socket.disconnect();
			disconnected = true;
		}

	  return {
	    on: on,
	    emit: emit,
			connect: connect,
			disconnect: disconnect
	  };
	}]);

angular.module('theeTable.services')
.factory('theeTableSoundcloud', [function() {

	/*************************************************************
	 * theeTableSoundcloud factory creates the soundcloud client *
	 * and facilitates the interation with the soundcloud api  	 *
	 *                                                           *
	 * Retrieve ID                                               *
	 * Retrieve soundcloud client instance                       *
	 * log into soundcloud                                       *
	 * like songs on soundcloud                                  *
	 * search on soundcloud                                      *
	 * import playlists/likes on soundcloud                      *
	 *************************************************************/

	var SC;
	var soundcloudID = {};

	var getSoundcloudID = function() {
		return soundcloudID;
	};

	var setSCinstance = function(scInit) {
		SC = scInit;
		return SC;
	};

	var getSCinstance = function() {
		return SC;
	};

	// log into soundcloud
	var loginSC = function(callback) {

		// initiate auth popup
		SC.connect(function() {

			// logic in here after connection and pop up closes
			SC.get('/me', function(me) {
				soundcloudID.id = me.id;
				soundcloudID.username = me.permalink;
				if (callback) {
					callback();
				}
			});

		});
	};

	// like on soundcloud
	var like = function(id) {
		SC.put('/me/favorites/'+id);
	};

	// search soundcloud
	var searchTracks = function(query, callback) {
		SC.get('/tracks', {q: query }, function(tracks) {
			callback(tracks);
		});
	};

	// obtain playlist and likes from soundcloud
	var getPlaylists = function(callback) {

		var playlists = '/users/' + soundcloudID.id + '/playlists';

		SC.get(playlists, function(playlistResults) {

			SC.get('/users/' + soundcloudID.id + '/favorites', function(favoriteResults) {
				callback(favoriteResults, playlistResults);
			});

			return;
		});

	};

	return {
		getSoundcloudID: getSoundcloudID,
		setSCinstance: setSCinstance,
		getSCinstance: getSCinstance,
		like: like,
		searchTracks: searchTracks,
		getPlaylists: getPlaylists,
		loginSC: loginSC
	};
}]);

angular.module('theeTable.services')
.factory('theeTableTime', [function() {

	/*************************************************************
	 * theeTabletime factory converts time in milliseconds to    *
	 * hours, minutes, and seconds.                              *
	 *                                                           *
	 * convert time                                              *
	 *************************************************************/

	var convertTime = function(duration) {
		var hours = Math.floor(duration / 3600000);
		var minutes = Math.floor((duration % 3600000) / 60000);
		var seconds = Math.floor(((duration % 360000) % 60000) / 1000);

		if (seconds < 10) {
			seconds = "0"+seconds;
		}

		if (minutes < 10) {
			minutes = "0"+minutes;
		}

		if (hours > 0) {
			return hours + ":" + minutes + ":" + seconds;
		}

		return minutes + ":" + seconds;
	}

	return {
		convertTime: convertTime
	};
}]);

angular.module('theeTable.services')
.factory('theeTableUrl', [function() {

	/************************************************************
	* theeTableUrl factory provides server URL and soundcloud   *
	* client ID                                               	*
	*                                                           *
	* server URL                                                *
	* soundcloud clientID                                       *
	*************************************************************/

	var getUrl = function() {
		return 'http://thee-table.herokuapp.com';
	};

	var getID = function() {
		return '3fad6addc9d20754f8457461d02465f2';
	};

	return {
		getUrl: getUrl,
		getID: getID
	};
}]);

!function(a){function b(a){return"undefined"!=typeof a&&null!==a?!0:!1}a(document).ready(function(){a("body").append("<div id=snackbar-container/>")}),a(document).on("click","[data-toggle=snackbar]",function(){a(this).snackbar("toggle")}).on("click","#snackbar-container .snackbar",function(){a(this).snackbar("hide")}),a.snackbar=function(c){if(b(c)&&c===Object(c)){var d;d=b(c.id)?a("#"+c.id):a("<div/>").attr("id","snackbar"+Date.now()).attr("class","snackbar");var e=d.hasClass("snackbar-opened");b(c.style)?d.attr("class","snackbar "+c.style):d.attr("class","snackbar"),c.timeout=b(c.timeout)?c.timeout:3e3,b(c.content)&&(d.find(".snackbar-content").length?d.find(".snackbar-content").text(c.content):d.prepend("<span class=snackbar-content>"+c.content+"</span>")),b(c.id)?d.insertAfter("#snackbar-container .snackbar:last-child"):d.appendTo("#snackbar-container"),b(c.action)&&"toggle"==c.action&&(c.action=e?"hide":"show");var f=Date.now();d.data("animationId1",f),setTimeout(function(){d.data("animationId1")===f&&(b(c.action)&&"show"!=c.action?b(c.action)&&"hide"==c.action&&d.removeClass("snackbar-opened"):d.addClass("snackbar-opened"))},50);var g=Date.now();return d.data("animationId2",g),0!==c.timeout&&setTimeout(function(){d.data("animationId2")===g&&d.removeClass("snackbar-opened")},c.timeout),d}return!1},a.fn.snackbar=function(c){var d={};if(this.hasClass("snackbar"))return d.id=this.attr("id"),("show"===c||"hide"===c||"toggle"==c)&&(d.action=c),a.snackbar(d);b(c)&&"show"!==c&&"hide"!==c&&"toggle"!=c||(d={content:a(this).attr("data-content"),style:a(this).attr("data-style"),timeout:a(this).attr("data-timeout")}),b(c)&&(d.id=this.attr("data-snackbar-id"),("show"===c||"hide"===c||"toggle"==c)&&(d.action=c));var e=a.snackbar(d);return this.attr("data-snackbar-id",e.attr("id")),e}}(jQuery);
