var jwt    = require('jsonwebtoken');
var keys   = require('./securityKeys.js');
var schema = require('./schema.js');
var jwtValidation = function(req, res, next) {
	var token = req.query.jwt_token;
  if ( token ) {
    jwt.verify(token, keys.jwtSecretKey, function(err, decoded) {
      if (!err) {
      	if (decoded.id) {
					req.query.id = decoded.id;
					next();
					return;
				}
				console.log('error with JWT');
				res.send({ message:'Error with JWT' });
			}
			console.log("here");
			console.log(err);
			res.send(err);
			return;
    });
  } else {
    res.send({message: 'You are not allowed to access this API'});
  }
};

module.exports = jwtValidation;
