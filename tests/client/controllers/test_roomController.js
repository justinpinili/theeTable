// describe('Unit: roomController', function() {
// 	// Load the module with MainController
// 	beforeEach(module('theeTable'));
//
// 	var roomController, $scope, $state, $stateParams, $location, $sce, locationStorageService, theeTableAuth, theeTableRooms, socket;
// 	// inject the $controller and $rootScope services
// 	// in the beforeEach block
// 	beforeEach(inject(function($controller, $rootScope, _$state_, _$stateParams_, _$location_, _$sce_, _localStorageService_, _theeTableAuth_, _theeTableRooms_) {
// 		// Create a new scope that's a child of the $rootScope
// 		$scope = $rootScope.$new();
// 		$state = _$state_;
// 		$stateParams = _$stateParams_;
// 		$location = _$location_;
// 		$sce = _$sce_;
// 		localStorageService = _localStorageService_;
// 		theeTableAuth = _theeTableAuth_;
// 		theeTableRooms = _theeTableRooms_;
// 		socket = new socketMock($rootScope);
// 		// Create the controller
// 		roomController = $controller('roomController', {
// 			$scope: $scope,
// 			socket: socket
// 		});
// 	}));
//
// 	describe("roomController", function() {
// 		it("should be defined and all of it's injections to be defined", function() {
// 			expect(roomController).toBeDefined();
// 			expect($scope).toBeDefined();
// 			expect($state).toBeDefined();
// 			expect($stateParams).toBeDefined();
// 			expect($location).toBeDefined();
// 			expect($sce).toBeDefined();
// 			expect(localStorageService).toBeDefined();
// 			expect(theeTableAuth).toBeDefined();
// 			expect(theeTableRooms).toBeDefined();
// 			expect(socket).toBeDefined();
// 		});
//
// 		describe("mainController's scope", function() {
// 			it('should have all scope functions', function() {
// 				expect(angular.isFunction($scope.addToQueue)).toBe(true);
// 				expect(angular.isFunction($scope.submitMessageDisabled)).toBe(true);
// 				expect(angular.isFunction($scope.submitMessage)).toBe(true);
// 				expect(angular.isFunction($scope.submitPlaylistItemDisabled)).toBe(true);
// 				expect(angular.isFunction($scope.submitPlaylistItem)).toBe(true);
// 			});
//
// 			it('should have all scope variables', function() {
// 				expect($scope.room).toBeDefined();
// 				expect($scope.newChatMessage).toBeDefined();
// 				expect($scope.newPlaylistItem).toBeDefined();
// 			});
//
// 			describe("$scope.addToQueue function", function() {
// 				it('should emit the name of the user that has chosen to go into the queue', function() {
// 					spyOn(socket, 'emit');
// 					$scope.$parent.currentUser = {};
// 					$scope.$parent.currentUser.username = 'justin';
// 					$scope.addToQueue();
// 					expect(socket.emit).toHaveBeenCalled();
// 					expect(socket.emit).toHaveBeenCalledWith('addToQueue', { user: 'justin' });
// 				});
// 			});
//
// 			describe("$scope.submitMessageDisabled function", function() {
// 				it('should return true when msg is undefined or an empty string', function() {
// 					var result = $scope.submitMessageDisabled();
// 					expect(result).toBe(true);
// 					$scope.newChatMessage.msg = 'herro prease!';
// 					result = $scope.submitMessageDisabled();
// 					expect(result).toBe(false);
// 				});
// 			});
//
// 			describe("$scope.submitMessage function", function() {
// 				it('should emit the message entered by the user', function() {
// 					spyOn(socket, 'emit');
// 					$scope.newChatMessage.msg = 'herro prease!';
// 					$scope.submitMessage($scope.newChatMessage.msg);
// 					expect(socket.emit).toHaveBeenCalled();
// 					expect(socket.emit).toHaveBeenCalledWith('newChatMessage', { msg: 'herro prease!' });
// 					expect($scope.newChatMessage.msg).toBe('');
// 				});
// 			});
//
// 			describe("$scope.submitPlaylistItemDisabled function", function() {
// 				it('should return true when msg is undefined or an empty string', function() {
// 					var result = $scope.submitPlaylistItemDisabled();
// 					expect(result).toBe(true);
// 					$scope.newPlaylistItem.url = 'pretend url';
// 					result = $scope.submitPlaylistItemDisabled();
// 					expect(result).toBe(false);
// 				});
// 			});
//
// 			describe("$scope.submitPlaylistItem function", function() {
// 				it('should emit the message entered by the user', function() {
// 					spyOn(socket, 'emit');
// 					$scope.newPlaylistItem.url = 'pretend url';
// 					$scope.submitPlaylistItem($scope.newPlaylistItem.url);
// 					expect(socket.emit).toHaveBeenCalled();
// 					expect(socket.emit).toHaveBeenCalledWith('newPlaylistItem', { source: 'pretend url' });
// 					expect($scope.newPlaylistItem.url).toBe('');
// 				});
// 			});
//
// 		});
// 	});
// });
//
// var socketMock = function($rootScope){
// 	this.events = {};
// 	this.emits = {};
//
// 	// intercept 'on' calls and capture the callbacks
// 	this.on = function(eventName, callback){
// 		if (!this.events[eventName]) {
// 			this.events[eventName] = [];
// 		}
// 		this.events[eventName].push(callback);
// 	};
//
// 	// intercept 'emit' calls from the client and record them to assert against in the test
// 	this.emit = function(eventName){
// 		var args = Array.prototype.slice.call(arguments, 1);
//
// 		if(!this.emits[eventName]) {
// 			this.emits[eventName] = [];
// 			this.emits[eventName].push(args);
// 		}
// 	};
//
//
// 	//simulate an inbound message to the socket from the server (only called from the test)
// 	this.receive = function(eventName){
// 		var args = Array.prototype.slice.call(arguments, 1);
//
// 		if(this.events[eventName]){
// 			angular.forEach(this.events[eventName], function(callback){
// 				$rootScope.$apply(function() {
// 					callback.apply(this, args);
// 				});
// 			});
// 		};
// 	};
// };
