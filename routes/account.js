var express = require('express');
var router = express.Router();
var utils = require("../utils");
var User = require("../models/user");

router.get('/', utils.ensureAuthenticated, function(req, res) {
	res.render('account');
});

router.post('/', utils.ensureAuthenticated, function(req, res) {
	var oldPassword = req.body.oldPassword;
	var newPassword = req.body.newPassword;
	var confirmPassword = req.body.confirmPassword;
	req.checkBody('newPassword', 'Please enter a password!').notEmpty();
	req.checkBody('confirmPassword', 'Passwords do not match.').equals(req.body.newPassword);

	var errors = req.validationErrors();
	if (errors) {
		req.flash('error_msg', 'Passwords do not match.');
		res.redirect('/account');
	} else {
		User.comparePassword(oldPassword, res.locals.user.password, function(error, isMatch) {
			if (error) throw error;
			if (isMatch) {
				console.log("test");
				User.changePassword(res.locals.user, newPassword, function(err, user) {
					if (err) throw err;
					req.flash('success_msg', 'Successfully changed password.');
					res.redirect('/account');
				});
			} else {
				req.flash('error_msg', 'Incorrect password.');
				res.redirect('/account');
			}
		});
	}
});

module.exports = router;