angular.module('theeTable.services')
.factory('theeTableUrl', [function() {

	/************************************************************
	* theeTableUrl factory provides server URL and soundcloud   *
	* client ID                                               	*
	*                                                           *
	* server URL                                                *
	* soundcloud clientID                                       *
	*************************************************************/

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
