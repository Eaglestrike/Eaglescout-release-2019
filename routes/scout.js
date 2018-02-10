var express = require('express');
var router = express.Router();
var User = require("../models/user");
var utils = require("../utils.js");

router.get('/list', utils.ensureAuthenticated, function(req, res) {
	res.render('list');
});

router.get('/new', utils.ensureAuthenticated, function(req, res) {
	res.render('new');
});

router.get('/', utils.ensureAuthenticated, function(req, res) {
	res.render('scout');
});

module.exports = router;