var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	email: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	admin: {
		type: Boolean
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.getUserByEmail = function(email, callback) {
	User.findOne({
		email: email
	}, callback);
};

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});	
};

module.exports.createAdminUserIfNotExists = function() {
	User.find({}, function (err, users) {
		if (users.length > 0)
			return;

		var user = new User({
			email: "admin@team114.org",
			password: "team114",
			admin: true
		});

		User.createUser(user, function() {});
    });
}

module.exports.changePassword = function(user, password, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash) {
			user.password = hash;
			user.save(callback);
		});
	});
};

module.exports.toggleAdmin = function(user, admin, callback) {
	user.admin = admin;
	user.save(callback);
};