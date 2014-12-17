describe('Unit: mainController', function() {
	// Load the module with MainController
	beforeEach(module('theeTable'));

	var mainController, $scope, locationStorageService, theeTableAuth;
	// inject the $controller and $rootScope services
	// in the beforeEach block
	beforeEach(inject(function($controller, $rootScope, _localStorageService_, _theeTableAuth_) {
		// Create a new scope that's a child of the $rootScope
		$scope = $rootScope.$new();
		localStorageService = _localStorageService_;
		theeTableAuth = _theeTableAuth_;
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
		});

		describe("mainController's scope", function() {
			it('should have all scope functions', function() {
				expect(angular.isFunction($scope.getUserInfo)).toBe(true);
			});

			describe("$scope.getUserInfo function", function() {
				it('should change between signup and login information', function() {
					spyOn(theeTableAuth, 'getUserInfo');
					$scope.getUserInfo();
					expect(theeTableAuth.getUserInfo).toHaveBeenCalled();

				})
			});
		});
	});
})
