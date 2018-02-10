var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/user");
var utils = require("../utils.js");

router.get('/', utils.redirectIfLoggedIn, function(req, res) {
	res.render('login');
});

passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done) {
		User.getUserByEmail(email, function(err, user) {
			if (err) throw err;
			if (!user) return done(null, false, {message: "Unknown user."});
			User.comparePassword(password, user.password, function(error, isMatch) {
				if (error) throw error;
				if (isMatch) return done(null, user);
				else return done(null, false, {message: "Invalid password."});
			});
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

router.post('/',
  passport.authenticate('local', {successRedirect: '/scout', failureRedirect: '/', failureFlash: true}),
  function(req, res) {
    res.redirect('/scout');
  });

router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success_msg', 'Successfully logged out.');
	res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in.');
		res.redirect('/');
	}
}

module.exports = router;