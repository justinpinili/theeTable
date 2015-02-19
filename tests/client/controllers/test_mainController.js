describe('Unit: mainController', function() {
	// Load the module with MainController
	beforeEach(module('theeTable'));

	var mainController, $scope, locationStorageService, theeTableAuth, $modal, theeTableSocket, theeTableSoundcloud, theeTableUrl, $location;
	// inject the $controller and $rootScope services
	// in the beforeEach block
	beforeEach(inject(function($controller, $rootScope, _localStorageService_, _theeTableAuth_, _$modal_, _theeTableSocket_, _theeTableSoundcloud_, _theeTableUrl_, _$location_) {
		// Create a new scope that's a child of the $rootScope
		$scope = $rootScope.$new();
		localStorageService = _localStorageService_;
		theeTableAuth = _theeTableAuth_;
		$modal = _$modal_;
		theeTableSocket = _theeTableSocket_;
		theeTableSoundcloud = _theeTableSoundcloud_;
		theeTableUrl = _$location_;
		// Create the controller
		mainController = $controller('mainController', {
			$scope: $scope
		});
	}));

	describe("mainController", function() {
		it("should be defined and all of it's injections to be defined", function() {
			expect(mainController).toBeDefined();
			expect($scope).toBeDefined();
			expect(localStorageService).toBeDefined();
			expect(theeTableAuth).toBeDefined();
			expect($modal).toBeDefined();
			expect(theeTableSocket).toBeDefined();
			expect(theeTableSoundcloud).toBeDefined();
			expect(theeTableUrl).toBeDefined();
		});

		describe("mainController's scope", function() {
			it('should have all scope variables and functions', function() {
				expect($scope.sc).toBeDefined();
				expect($scope.socket).toBeDefined();
				expect(angular.isFunction($scope.inRoom)).toBe(true);
				expect(angular.isFunction($scope.getUserInfo)).toBe(true);
				expect(angular.isFunction($scope.credits)).toBe(true);
				expect(angular.isFunction($scope.auth)).toBe(true);
				expect(angular.isFunction($scope.viewFavorites)).toBe(true);
				expect(angular.isFunction($scope.viewFavoriteRooms)).toBe(true);
				expect(angular.isFunction($scope.getSoundcloudID)).toBe(true);
				expect(angular.isFunction($scope.getSCinstance)).toBe(true);
				expect(angular.isFunction($scope.loginSC)).toBe(true);
				expect(angular.isFunction($scope.likeSongOnSC)).toBe(true);
			});

			describe("$scope.getUserInfo function", function() {
				it('should use theeTableAuth to obtain user information from the db', function() {
					spyOn(theeTableAuth, 'getUserInfo');
					$scope.getUserInfo();
					expect(theeTableAuth.getUserInfo).toHaveBeenCalled();
				});
			});

			describe("$scope.credits function", function() {
				it('should open a modal displaying credits', function() {
					spyOn($modal, 'open');
					$scope.credits();
					expect($modal.open).toHaveBeenCalled();
				});
			});

			describe("$scope.auth function", function() {
				it('should open a modal displaying authorization options', function() {
					spyOn($modal, 'open');
					$scope.auth();
					expect($modal.open).toHaveBeenCalled();
				});
			});

			describe("$scope.viewFavorites function", function() {
				it('should open a modal displaying a users liked songs', function() {
					spyOn($modal, 'open');
					$scope.viewFavorites();
					expect($modal.open).toHaveBeenCalled();
				});
			});

			describe("$scope.viewFavoriteRooms function", function() {
				it('should open a modal displaying a users favorite rooms', function() {
					spyOn($modal, 'open');
					$scope.viewFavoriteRooms();
					expect($modal.open).toHaveBeenCalled();
				});
			});

			describe("$scope.getSoundcloudID function", function() {
				it('should open a modal displaying a users favorite rooms', function() {
					spyOn(theeTableSoundcloud, 'getSoundcloudID');
					$scope.getSoundcloudID();
					expect(theeTableSoundcloud.getSoundcloudID).toHaveBeenCalled();
				});
			});

			describe("$scope.getSCinstance function", function() {
				it('should use theeTableSoundcloud to get a soundcloud ID', function() {
					spyOn(theeTableSoundcloud, 'getSCinstance');
					$scope.getSCinstance();
					expect(theeTableSoundcloud.getSCinstance).toHaveBeenCalled();
				});
			});

			describe("$scope.loginSC function", function() {
				it('should use theeTableSoundcloud to log in via soundcloud', function() {
					spyOn(theeTableSoundcloud, 'loginSC');
					$scope.loginSC();
					expect(theeTableSoundcloud.loginSC).toHaveBeenCalled();
				});
			});

			describe("$scope.likeSongOnSC function", function() {
				it('should use theeTableSoundcloud to like a song on soundcloud', function() {
					spyOn(theeTableSoundcloud, 'like');
					$scope.likeSongOnSC();
					expect(theeTableSoundcloud.like).toHaveBeenCalled();
				});
			});

		});
	});
})
