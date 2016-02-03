angular
	.module('theeTable.routes', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider', function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
		localStorageServiceProvider
			.setPrefix('theeTable');

		$stateProvider
			.state('home', {
				url: '/home',
				controller: ['$scope', function($scope) {
					$scope.$parent.showApp = false;
				}],
				templateUrl: './js/app.html'
			})
			.state('rooms', {
				url: '/rooms',
				controller: 'roomsController',
				templateUrl: './js/rooms/rooms.html'
			})
			.state('room', {
				url: '/rooms/:roomName',
				controller: 'roomController',
				templateUrl: './js/room/room.html',
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
