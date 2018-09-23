angular.module('theeTable.directives')
.directive('roomInterface', ['theeTableSoundcloud', function(theeTableSoundcloud) {

	return {
		restrict: 'E',
		templateUrl: './js/room/roomInterfaceDirective.html',
		scope: {
			title: '=',
			room: '=',
			currentUser: '=',
			liked: '=',
			socket: '=',
			sound: '=',
			showing: '='

		},
		controller: ['$scope', 'theeTableTime', function($scope, theeTableTime) {
			// displays the correct time when a song is playing
			// (counting down)
			$scope.convertTime = function(duration) {
				return theeTableTime.convertTime(duration);
			};

			// allows a user to save the current song playing to their  likes
			// (if logged into soundcloud, it will like it on soundcloud as well)
			$scope.like = function(song) {
				theeTableSoundcloud.like(song.soundcloudID);
				$.snackbar({content: "<i class='mdi-file-cloud-queue big-icon'></i> " + song.title + " has been added to your soundcloud likes" });
				return;
			}

			// adds current user to the queue
			$scope.addToQueue = function() {
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

			$scope.refreshPlayer = function() {
				$scope.refresh = true;
				setTimeout(function() {
					$scope.refresh = false;
				},1000);
			};

		}],
		link: function(scope, element, attrs) {

			$(document).ready(function() {
				setTimeout(function() {
					$.material.init();
				}, 0);
			});

			scope.$watch('showing', function(showing) {
				if (showing) {
					angular.element(element[0].children[0]).addClass('over-left');
				angular.element(element[0].children[0]).removeClass('not-over-left');
					return;
				}
				angular.element(element[0].children[0]).removeClass('over-left');
					angular.element(element[0].children[0]).addClass('not-over-left');
			});

		}
	}
}]);
