var schema = require('./../../schema.js');

module.exports.allRooms = function(callback) {
	schema.Room.find({}, function(err, rooms) {
		if (!err) {
			callback({rooms: rooms});
			return;
		}
		console.log(err);
		callback({ error: err });
		return;
	});
};

module.exports.createRoom = function(name, callback) {
	var newRoom = new schema.Room({
		name: name,
		queue: [],
		chat: [],
		users: [],
		currentDJ: null,
		currentSong: null,
		currentTime: null
	});
	newRoom.save(function (err) {
		if (!err) {
			// console.log('new room saved!');
			callback(newRoom);
			return;
		}
		if (err.code === 11000) {
			callback({ message: "Room already exists. Please choose a different name." });
			return;
		}
		console.log(err);
		callback({ error: err });
		return;
	});
};

module.exports.findRoom = function(id, callback) {
	var searchRoom  = schema.Room.where({ name: id });
	searchRoom.findOne(function (err, room) {
		if (!err) {
			if (room === null) {
				callback({ message: "Room does not exist" });
				return;
			} else {
				callback(room);
				return;
			}
		}
		console.log(err);
		callback({ error: err });
		return;
	});
};
