// describe('Unit: roomsController', function() {
// 	// Load the module with MainController
// 	beforeEach(module('theeTable'));
//
// 	var roomsController, $scope, $location, locationStorageService, theeTableAuth, theeTableRooms;
// 	// inject the $controller and $rootScope services
// 	// in the beforeEach block
// 	beforeEach(inject(function($controller, $rootScope, _$location_, _localStorageService_, _theeTableAuth_, _theeTableRooms_) {
// 		// Create a new scope that's a child of the $rootScope
// 		$scope = $rootScope.$new();
// 		$location = _$location_;
// 		localStorageService = _localStorageService_;
// 		theeTableAuth = _theeTableAuth_;
// 		theeTableRooms = _theeTableRooms_;
// 		// Create the controller
// 		roomsController = $controller('roomsController', {
// 			$scope: $scope
// 		});
// 	}));
//
// 	describe("roomsController", function() {
// 		it("should be defined and all of it's injections to be defined", function() {
// 			expect(roomsController).toBeDefined();
// 			expect($scope).toBeDefined();
// 			expect($location).toBeDefined();
// 			expect(localStorageService).toBeDefined();
// 			expect(theeTableAuth).toBeDefined();
// 			expect(theeTableRooms).toBeDefined();
// 		});
//
// 		describe("roomsController's scope", function() {
// 			it('should have all scope functions', function() {
// 				expect(angular.isFunction($scope.navigate)).toBe(true);
// 				expect(angular.isFunction($scope.create)).toBe(true);
// 				expect(angular.isFunction($scope.createDisabled)).toBe(true);
// 			});
//
// 			it('should have all scope variables', function() {
// 				expect($scope.rooms).toBeDefined();
// 				expect($scope.newRoom).toBeDefined();
// 			});
//
// 			describe("$scope.navigate function", function() {
// 				it('should navigate to the provided room name', function() {
// 					spyOn($location, 'path');
// 					$scope.navigate('lobby');
// 					expect($location.path).toHaveBeenCalled();
// 					expect($location.path).toHaveBeenCalledWith('/rooms/lobby');
// 				});
// 			});
//
// 			describe("$scope.create function", function() {
// 				it('should create a new room with the given room name', function() {
// 					spyOn(theeTableRooms, 'createRoom');
// 					$scope.create('lobby3');
// 					expect(theeTableRooms.createRoom).toHaveBeenCalled();
// 				});
// 			});
//
// 			describe("$scope.createDisabled function", function() {
// 				it('should return true when room is undefined or an empty string', function() {
// 					var result = $scope.createDisabled();
// 					expect(result).toBe(true);
// 					$scope.newRoom.room = 'lobby3';
// 					result = $scope.createDisabled();
// 					expect(result).toBe(false);
// 				});
// 			});
// 		});
// 	});
// })
