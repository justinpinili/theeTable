angular.module('theeTable.services')
.factory('theeTableUrl', [function() {
	var getUrl = function() {
		return 'http://localhost:1337';
	};

	var getID = function() {
		return '3fad6addc9d20754f8457461d02465f2';
	};

	return {
		getUrl: getUrl,
		getID: getID
	};
}]);
