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
		return ttURL;
	};

	var getID = function() {
		return scID;
	};

	return {
		getUrl: getUrl,
		getID: getID
	};
}]);
