module.exports = function(io) {

	var express = require('express');
	var schema = require('./../schema.js');
	var router = express.Router();

	// Add song to the queue
	router.post('/queue/:id', function(req, res) {
		// console.log('queue/'+req.params.id);
		var searchRoom  = schema.Room.where({ name: req.params.id });
		searchRoom.findOne(function (err, room) {
			if (!err) {
				if (room === null) {
					res.send({ message: "Room does not exist" });
					return;
				} else {
					var newSong = req.body;
					newSong.votes = 0;

					room.queue.push(newSong);
					room.save(function (err) {
						if (!err) {
							// console.log("queue saved!");
							res.send(room.queue);
							return;
						}
						console.log(err);
						res.send(err);
						return;
					});
					return;
				}
			}
			console.log(err);
			res.send(err);
			return;
		});
	});

	return router;
};
