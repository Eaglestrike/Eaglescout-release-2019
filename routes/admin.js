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
		User.find({
			email: email
		}, function(err, users) {
			if (users.length > 0) {
				req.flash('error_msg', 'Account already exists!');
				res.redirect('/admin/register');
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
	}
});

router.post('/bulkimport', utils.ensureAdmin, function(req, res) {
	var textbox = req.body.bulkimport;
	var password = req.body.password;

	req.checkBody('password', 'Please enter a password!').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		req.flash('error_msg', 'Please enter a password!');
		res.redirect('/admin/bulkimport');
	} else {
		var emails = textbox.split("\n");

		for (var email in emails) {
			while (emails[email].endsWith("\r")) {
				emails[email] = emails[email].slice(0, -1);
			}

			if (emails[email].trim() == "") {
				continue;
			}

			User.find({
				email: emails[email]
			}, function(err, users) {
				if (users.length == 0) {
					var newUser = new User({
						email: emails[email],
						password: password,
						admin: false
					});

					User.createUser(newUser, function(err, user) {
						if (err) throw err;
					});
				}
			});
		}

		req.flash('success_msg', 'Successfully bulk registered users. Their password is "' + password + '".');
		res.redirect("/admin");
	}
});

router.get('/userlist', utils.ensureAdmin, function(req, res) {
	User.find({}, function(err, users) {
		res.render('userlist', {
			users: users
		});
	});
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

router.get('/deluser/:id', utils.ensureAdmin, function(req, res) {
	if (res.locals.user.id == req.params.id) {
		req.flash('error_msg', 'You cannot delete your own account! Did NOT delete user!');
		res.redirect('/admin/edituser/' + req.params.id);
		return;
	}
	User.remove({
		"_id": req.params.id
	}, function(err) {
		if (err) throw err;
		req.flash('success_msg', 'Successfully deleted user.');
		res.redirect('/admin/userlist');
	});
});

router.get('/edituser/:id', utils.ensureAdmin, function(req, res) {
	User.findOne({
		"_id": req.params.id
	}, function(err, user) {
		res.render('edituser', {
			id: user["id"],
			email: user["email"],
			admin: user["admin"] ? 'checked="checked"' : ''
		});
	});
});

router.post('/toggleadmin/:id', utils.ensureAdmin, function(req, res) {
	User.findOne({
		"_id": req.params.id
	}, function(err, user) {
		User.toggleAdmin(user, req.body.admin == "on", function(err, user) {
			if (err) throw err;
			req.flash('success_msg', 'Successfully toggled admin state of user.');
			res.redirect('/admin/edituser/' + req.params.id);
		});
	});	
});

router.post('/changepassword/:id', utils.ensureAdmin, function(req, res) {
	User.findOne({
		"_id": req.params.id
	}, function(err, user) {
		var newPassword = req.body.newPassword;
		var confirmPassword = req.body.confirmPassword;
		req.checkBody('newPassword', 'Please enter a password!').notEmpty();
		req.checkBody('confirmPassword', 'Passwords do not match.').equals(req.body.newPassword);

		var errors = req.validationErrors();
		if (errors) {
			req.flash('error_msg', 'Passwords do not match.');
			res.redirect('/admin/edituser/' + req.params.id);
		} else {
			User.changePassword(user, newPassword, function(err, user) {
				if (err) throw err;
				req.flash('success_msg', 'Successfully changed password of user.');
				res.redirect('/admin/edituser/' + req.params.id);
			});
		}
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