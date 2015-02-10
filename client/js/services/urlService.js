angular.module('theeTable.services')
.factory('theeTableUrl', [function() {
	var getUrl = function(duration) {
		return 'http://localhost:1337';
	}

	return {
		getUrl: getUrl
	};
}]);
