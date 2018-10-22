const express = require('express');
const router = express.Router();
const User = require("../models/user");
const utils = require("../utils");
const TBA = require("../TBA");
const fs = require('fs');


router.get('/register', utils.ensureAdmin, function(req, res) {
	res.render('register');
});

router.get('/bulkimport', utils.ensureAdmin, function(req, res) {
	res.render('bulkimport');
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
			password: password,
			admin: req.body.admin == "on"
		});

		User.createUser(newUser, function(err, user) {
			if (err) throw err;
		});

		req.flash('success_msg', 'Successfully registered user.');
		res.redirect("/admin/register");
	}
});

router.post('/bulkimport', utils.ensureAdmin, function(req, res) {
	var textbox = req.body.bulkimport;
	var emails = textbox.split("\n");

	for (var email in emails) {
		while (emails[email].endsWith("\r")) {
			emails[email] = emails[email].slice(0, -1);
		}

		if (emails[email].trim() == "") {
			continue;
		}

		var newUser = new User({
			email: emails[email],
			password: "team114"
		});

		User.createUser(newUser, function(err, user) {
			if (err) throw err;
		});
	}

	req.flash('success_msg', 'Successfully bulk registered users. Their password is "team114".');
	res.redirect("/admin");
});

router.get('/', utils.ensureAdmin, function(req, res) {
	res.render('admin');
});

router.get('/event', utils.ensureAdmin, function(req, res) {
	TBA.getEvents((events) => {
		res.render('event', {
			events: events
		});
	});
});

router.post('/event', utils.ensureAdmin, function(req, res) {
	var event = req.body.event;
	req.checkBody('event', 'Please select an event!').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		TBA.getEvents((events) => {
			res.render('event', {
				errors: errors,
				events: events
			});
		});
	} else {
		fs.readFile('state.db', function(err, buf) {
			if (err) throw err;
			
			var json = JSON.parse(buf.toString());
			json["current_event"] = event;

			fs.writeFile('state.db', JSON.stringify(json), function(error, data) {
				if (error) throw error;
				
				req.flash('success_msg', 'Successfully changed event.');
				res.redirect("/admin/event");
			});
		});
	}
});

module.exports = router;