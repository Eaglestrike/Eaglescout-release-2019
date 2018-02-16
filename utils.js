var fs = require('fs');

module.exports = {
	ensureAuthenticated: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash('error_msg', 'You are not logged in.');
			res.redirect('/');
		}
	},
	redirectIfLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/scout')
		} else {
			return next();
		}
	},
	ensureAdmin: function(req, res, next) {
		if (req.isAuthenticated() && res.locals.user.admin) {
			return next();
		} else {
			req.flash('error_msg', 'You are not an admin.');
			res.redirect('/scout');
		}
	},
	getCurrentEvent: function() {
		var buffer = fs.readFileSync('state.db');
		var json = JSON.parse(buffer.toString());
		return json["current_event"];
	}
};


