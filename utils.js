module.exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in.');
		res.redirect('/');
	}
}

module.exports.redirectIfLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect('/scout')
	} else {
		return next();
	}
}

module.exports.ensureAdmin = function(req, res, next) {
	if (req.isAuthenticated() && res.locals.user.admin) {
		return next();
	} else {
		req.flash('error_msg', 'You are not an admin.');
		res.redirect('/scout');
	}
}