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