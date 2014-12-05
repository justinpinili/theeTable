angular.module('theeTable.controllers')
	.controller('roomController', function($scope, $state, $http, $stateParams, $location) {

		$scope.room;

		var socket = io.connect();

		socket.emit('roomEntered', { room: $stateParams.roomName, user: Date.now()});

		socket.on('usersInRoom', function(data) {
			$scope.$apply(function() {
				$scope.room.users = data.users;
				// console.log($scope.room.users);
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

		$http.get('http://localhost:1337/rooms/'+$stateParams.roomName)
			.success(function(result) {
				if (!result.message) {
					// console.log(result);
					$scope.room = result;
					return;
				}
				// $scope.message = result.message;
				// console.log(result.message);
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
