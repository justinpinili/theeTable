describe("theeTableAuth", function () {

	beforeEach(module('theeTable'));

	var theeTableAuth //, $http, localStorageService, $location;

	beforeEach(inject(function (_theeTableAuth_, _$http_, _localStorageService_, _$location_) {
		theeTableAuth = _theeTableAuth_;
		// $http = _$http_;
		// localStorageService = _localStorageService_;
		// $location = _$location_;
	}));

	describe('theeTableAuth', function() {
		it('should have 3 functions', function() {
			expect(angular.isFunction(theeTableAuth.siteAccess)).toBe(true);
			expect(angular.isFunction(theeTableAuth.getUserInfo)).toBe(true);
			expect(angular.isFunction(theeTableAuth.verifyJwt)).toBe(true);
		});

		describe('siteAccess function', function() {
			it('should invoke an http POST', function() {
				// spyOn($http, 'post');
				spyOn(theeTableAuth, 'siteAccess');
				theeTableAuth.siteAccess('url', 'username', 'password', function(result) {
					console.log("run!");
				});
				expect(theeTableAuth.siteAccess).toHaveBeenCalled();
				// expect($http.post).toHaveBeenCalled();
			});
		});

		describe('getUserInfo function', function() {
			it('should obtain a JWT and invoke an http GET', function() {
				// spyOn(localStorageService, 'get');
				spyOn(theeTableAuth, 'getUserInfo');
				theeTableAuth.getUserInfo(function(result) {
					console.log("run!");
				});
				expect(theeTableAuth.getUserInfo).toHaveBeenCalled();
				// expect(localStorageService.get).toHaveBeenCalled();
			});
		});

		describe('verifyJwt function', function() {
			it('should obtain a JWT and redirect if it is not present', function() {
				// spyOn(localStorageService, 'get');
				spyOn(theeTableAuth, 'verifyJwt');
				// spyOn($location, 'path');
				var result = theeTableAuth.verifyJwt();
				expect(theeTableAuth.verifyJwt).toHaveBeenCalled();
				// expect($location.path).toHaveBeenCalled();
				// expect(result).toBe(false);
			});
		});
	});

});
