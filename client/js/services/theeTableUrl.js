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
		return 'http://thee-table.herokuapp.com';
	};

	var getID = function() {
		return soundcloudClientID;
	};

	return {
		getUrl: getUrl,
		getID: getID
	};
}]);
