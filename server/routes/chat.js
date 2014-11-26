var express = require('express');
var schema = require('./../schema.js');
var router = express.Router();

// Add message to the messages
router.post('/chat/:id', function(req, res) {
	console.log('chat/'+req.params.id);
	var searchRoom  = schema.Room.where({ name: req.params.id });
	searchRoom.findOne(function (err, room) {
		if (!err) {
			if (room === null) {
				res.send("Room does not exist");
				return;
			} else {
				room.chat.push(req.body);
				room.save(function (err) {
				  if (!err) {
						console.log("chat saved!");
						res.send(room);
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

module.exports = router;
