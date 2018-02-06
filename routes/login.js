var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/user");

router.get('/', function(req, res) {
	res.render('login');
});

passport.use(new LocalStrategy(
	function(email, password, done) {
		User.getUserByEmail(email, function(err, usr) {
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

module.exports = router;