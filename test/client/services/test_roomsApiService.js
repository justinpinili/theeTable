describe("theeTableAuth", function () {

	beforeEach(module('theeTable'));

	var theeTableRooms;

	beforeEach(inject(function (_theeTableRooms_) {
		theeTableRooms = _theeTableRooms_;
	}));

	describe('theeTableRooms', function() {
		it('should have 3 functions', function() {
			expect(angular.isFunction(theeTableRooms.getAllRooms)).toBe(true);
			expect(angular.isFunction(theeTableRooms.createRoom)).toBe(true);
			expect(angular.isFunction(theeTableRooms.getRoomInfo	)).toBe(true);
		});

		describe('getAllRooms function', function() {
			it('should invoke an http GET', function() {
				// spyOn($http, 'get');
				spyOn(theeTableRooms, 'getAllRooms');
				theeTableRooms.getAllRooms(function(result) {
					console.log("run!");
				});
				expect(theeTableRooms.getAllRooms).toHaveBeenCalled();
				// expect($http.get).toHaveBeenCalled();
			});
		});

		describe('createRoom function', function() {
			it('should invoke an http POST', function() {
				// spyOn($http, 'post');
				spyOn(theeTableRooms, 'createRoom');
				theeTableRooms.createRoom('lobby3', function(result) {
					console.log("run!");
				});
				expect(theeTableRooms.createRoom).toHaveBeenCalled();
				// expect($http.post).toHaveBeenCalled();
			});
		});

		describe('getRoomInfo function', function() {
			it('should obtain a JWT and invoke an http GET', function() {
				// spyOn(localStorageService, 'get');
				spyOn(theeTableRooms, 'getRoomInfo');
				theeTableRooms.getRoomInfo('lobby', function(result) {
					console.log("run!");
				});
				expect(theeTableRooms.getRoomInfo).toHaveBeenCalled();
				// expect(localStorageService.get).toHaveBeenCalled();
			});
		});

	});

});
