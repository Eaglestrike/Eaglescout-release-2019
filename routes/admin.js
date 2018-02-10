var express = require('express');
var router = express.Router();
var User = require("../models/user");
var utils = require("../utils.js");

router.get('/register', utils.ensureAdmin, function(req, res) {
	res.render('register');
});

router.post('/register', utils.ensureAdmin, function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var confirmPassword = req.body.confirmPassword;
	req.checkBody('email', 'Please enter a valid email!').isEmail();
	req.checkBody('password', 'Please enter a password!').notEmpty();
	req.checkBody('confirmPassword', 'Passwords do not match.').equals(req.body.password);

	var errors = req.validationErrors();
	if (errors) {
		res.render('register', {
			errors: errors
		});
	} else {
		var newUser = new User({
			email: email,
			password: password
		});

		User.createUser(newUser, function(err, user) {
			if (err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Successfully registered user.');
		res.redirect("/admin/register");
	}
});

router.get('/', utils.ensureAdmin, function(req, res) {
	res.render('admin');
});

router.get('/event', utils.ensureAdmin, function(req, res) {
	res.render('event');
});

module.exports = router;