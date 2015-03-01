angular.module('theeTable.controllers')
.controller('searchController', ['$scope', '$modalInstance', '$modal', 'playlist', 'getSCinstance', 'theeTableSoundcloud', 'theeTableTime', 'lower', '$sce', function($scope, $modalInstance, $modal, playlist, getSCinstance, theeTableSoundcloud, theeTableTime, lower, $sce) {

	/************************************************************
	 * searchController allows the user to search on soundcloud *
	 * and can add results to their playlist   					        *
	 ************************************************************/

	$scope.soundcloud = {};

	// search soundcloud
	$scope.search = function(query) {

		$scope.soundcloud.results = [];
		$scope.searching = true;

		query = $('#soundcloudSearch').val();

		theeTableSoundcloud.searchTracks(query, function(tracks) {
			$scope.searching = false;

			$scope.$apply(function() {
				$scope.soundcloud.results = tracks;
			});
		});

		$scope.soundcloud.query = '';
		$('#soundcloudSearch').val('');

		return;
	};

	// display proper time
	$scope.convertTime = function(duration) {
		return theeTableTime.convertTime(duration);
	};

	// adds chosen song to the playlist
	// also remove's the from the search results
	$scope.addSongToPlaylist = function(url, title, artist, length, id, index) {
		$scope.soundcloud.results.splice(index,1);
		$scope.$parent.newSong = { source: url, title: title, artist: artist, length: length, soundcloudID: id };
		playlist.push({ source: url, title: title, artist: artist, length: length, soundcloudID: id });
		return;
	};

	$scope.showPreview = false;
	$scope.previewSource = '';

	var sce = function(song) {
		return $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url='+song+'&auto_play=true');
	}

	var widget;

	$scope.preview = function(index) {
		lower();
		$scope.showPreview = true;
		console.log(index);
		console.log($scope.soundcloud);
		$scope.previewSource = sce($scope.soundcloud.results[index].permalink_url);
		console.log($scope.previewSource.toString());
		$scope.previewIndex = index;

		setTimeout(function() {
			var widgetID = 'sc-widget'+index;

			var widgetIframe = document.getElementById(widgetID);

			if (widget !== undefined) {
				widget.unbind(SC.Widget.Events.READY);
			}

			widget = SC.Widget(widgetIframe);

			widget.bind(SC.Widget.Events.READY, function() {
				widget.play();
			});

		}, 500);
	}

	// close modal
	$scope.close = function() {
		$modalInstance.close();
	}

}]);
