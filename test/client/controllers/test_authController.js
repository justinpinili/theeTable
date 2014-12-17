describe('Unit: authController', function() {
	// Load the module with MainController
	beforeEach(module('theeTable'));

	var authController, $scope, $location, locationStorageService, theeTableAuth;
	// inject the $controller and $rootScope services
	// in the beforeEach block
	beforeEach(inject(function($controller, $rootScope, _$location_, _localStorageService_, _theeTableAuth_) {
		// Create a new scope that's a child of the $rootScope
		$scope = $rootScope.$new();
		$location = _$location_;
		localStorageService = _localStorageService_;
		theeTableAuth = _theeTableAuth_;
		// Create the controller
		authController = $controller('authController', {
			$scope: $scope
		});
	}));

	describe("authController", function() {
		it("should be defined and all of it's injections to be defined", function() {
			expect(authController).toBeDefined();
			expect($scope).toBeDefined();
			expect($location).toBeDefined();
			expect(localStorageService).toBeDefined();
			expect(authController).toBeDefined();
		});

		describe("authController's scope", function() {
			it('should have all scope functions', function() {
				expect(angular.isFunction($scope.switchForm)).toBe(true);
				expect(angular.isFunction($scope.auth)).toBe(true);
				expect(angular.isFunction($scope.authDisabled)).toBe(true);
			});

			it('should have all scope variables', function() {
				expect($scope.login).toBeDefined();
				expect($scope.current).toBeDefined();
				expect($scope.url).toBeDefined();
			})

			describe("$scope.switchForm function", function() {
				it('should change between signup and login information', function() {
					$scope.switchForm();
					expect($scope.current).toBe('signup');
					expect($scope.url).toBe('http://localhost:1337/user/new');
					$scope.switchForm();
					expect($scope.current).toBe('login');
					expect($scope.url).toBe('http://localhost:1337/user/login');
				})
			});

			describe("$scope.auth function", function() {
				it('should invoke the theeTableAuth.siteAccess function', function() {
					spyOn(theeTableAuth, 'siteAccess');
					$scope.auth('justin', 'test');
					expect(theeTableAuth.siteAccess).toHaveBeenCalled();
				})
			});

			describe("$scope.authDisabled function", function() {
				it('should return true when username and password is undefined or an empty string', function() {
					var result = $scope.authDisabled();
					expect(result).toBe(true);
					$scope.login.username = 'justin';
					$scope.login.password = 'test';
					result = $scope.authDisabled();
					expect(result).toBe(false);
				})
			});
		});
	});
})
