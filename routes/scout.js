var express = require('express');
var router = express.Router();
var User = require("../models/user");
var utils = require("../utils");
var TBA = require("../TBA");
var observationForm = require("../observationForm.js");

router.get('/list', utils.ensureAuthenticated, function(req, res) {
	res.render('list');
});

router.get('/new', utils.ensureAuthenticated, function(req, res) {
	TBA.getEvents((events) => {
		var structure = observationForm.getObservationFormStructure();
		structure.events = events;
		res.render('new', {
			structure: structure
		});
	});
});

router.get('/', utils.ensureAuthenticated, function(req, res) {
	res.render('scout');
});

module.exports = router;