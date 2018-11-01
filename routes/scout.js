var express = require('express');
var router = express.Router();
var Observation = require("../models/observation");
var utils = require("../utils");
var TBA = require("../TBA");
var observationForm = require("../observationForm.js");
var userlist = require("../userlist.js");
var filters = require("../config/filters");
var multipliers = require("../config/multipliers");

router.get('/list', utils.ensureAuthenticated, function(req, res) {
	Observation.find({}, function(err, observations) {
		observations.sort(function(a,b) {
			return a.team - b.team;
		});
		res.render('list', {
			observations: observations
		});
	});
});

router.get('/teamranking', utils.ensureAuthenticated, function(req, res) {
	Observation.find({}, function(err, observations) {
		var rankings = {};
		for (var observation in observations) {
			var team = observations[observation]["team"];
			if (!(team in rankings)) {
				// Custom stuff
				rankings[team] = {
					'switch_cubes': [],
					'scale_cubes': [],
					'exchange_cubes': [],
					'cubes_dropped': [],
					'climbed': false,
					'lifted': false,
					'auton_drove_forward': false,
					'auton_switch': false,
					'auton_scale': false,
					'death_percent': [],
					'speeds': []
				};
			}
			var time_robot_dead = observations[observation]['teleop_time_robot_died'] == "" ? 0 : parseInt(observations[observation]['teleop_time_robot_died']);
			rankings[team]['death_percent'].push(time_robot_dead / 150);
			// Only count switch, scale, and exchange if time dead is less than 45 seconds
			if (time_robot_dead < 45) {
				if (!isNaN(parseInt(observations[observation]['teleop_switch_cubes']))) rankings[team]['switch_cubes'].push(parseInt(observations[observation]['teleop_switch_cubes']));
				if (!isNaN(parseInt(observations[observation]['teleop_scale_cubes']))) rankings[team]['scale_cubes'].push(parseInt(observations[observation]['teleop_scale_cubes']));
				if (!isNaN(parseInt(observations[observation]['teleop_cubes_dropped']))) rankings[team]['cubes_dropped'].push(parseInt(observations[observation]['teleop_cubes_dropped']));
				if (!isNaN(parseInt(observations[observation]['teleop_exchange_cubes']))) rankings[team]['exchange_cubes'].push(parseInt(observations[observation]['teleop_exchange_cubes']));
			}
			// Only count speed if time dead is less than 120 seconds
			if (time_robot_dead < 120 && observations[observation]['speed'] != null && observations[observation]['speed'] != "") {
				var speed;
				switch (observations[observation]['speed']) {
					case "slow": 
					speed = -1;
					break;
					case "medium": 
					speed = 0;
					break;
					case "fast": 
					speed = 1;
					break;
				}
				rankings[team]['speeds'].push(speed);
			}
			if (observations[observation]['endgame_successful_climb'] == "yes") rankings[team]['climbed'] = true;
			if (observations[observation]['endgame_help_others_climb'] == "yes") rankings[team]['lifted'] = true;
			if (observations[observation]['auto_cross_line'] == "yes") rankings[team]['auton_drove_forward'] = true;
			if (observations[observation]['auto_scale_cubes'] == "yes") rankings[team]['auton_scale'] = true;
			if (observations[observation]['auto_switch_cubes'] == "yes") rankings[team]['auton_switch'] = true;
		}

		var points = [];
		for (var ranking in rankings) {
			var filter;
			switch (req.query.filter) {
				case "switch_cubes":
					filter = filters.switch_cubes;
					break;
				case "scale_cubes":
					filter = filters.scale_cubes;
					break;
				case "exchange_cubes":
					filter = filters.exchange_cubes;
					break;
				case "climb":
					filter = filters.climb;
					break;
				case "lift":
					filter = filters.lift;
					break;
				case "speed":
					filter = filters.speed;
					break;
				case "undefined":
					filter = multipliers.multipliers;
					break;
				default:
					filter = multipliers.multipliers;
					break;
			}
			var currentObj = {
				team: ranking
			}
			var currentPoints = 0;
			for (var multiplier in filter) {
				if (Array.isArray(rankings[ranking][multiplier])) currentPoints += utils.average(rankings[ranking][multiplier]) * filter[multiplier];
				else currentPoints += rankings[ranking][multiplier] * filter[multiplier];
			}
			currentObj['points'] = Math.round(currentPoints);
			points.push(currentObj);
		}

		var index = 0;
		function asyncForLoop() {
			if (index == points.length) {
				points.sort(function(a,b) {
					return b.points - a.points;
				});
				res.render('teamranking', {
					points: points,
					switch_cubes: req.query.filter == "switch_cubes",
					scale_cubes: req.query.filter == "scale_cubes",
					exchange_cubes: req.query.filter == "exchange_cubes",
					climb: req.query.filter == "climb",
					lift: req.query.filter == "lift",
					speed: req.query.filter == "speed"
				});
			} else {
				TBA.getImage(points[index]["team"], image => {
					points[index ++]["image"] = image;
					asyncForLoop();
				});
			}
		}
		asyncForLoop();
	});
});

router.get('/csv', utils.ensureAuthenticated, function(req, res) {
	res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=observations.csv'
    });
    Observation.find({}).csv(res);
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

router.post('/new', utils.ensureAuthenticated, function(req, res) {
	req.body.user = res.locals.user.email;
	delete req.body.action;
	var newObservation = new Observation(req.body);

	Observation.createObservation(newObservation, function(err, user) {
		if (err) throw err;
	});

	req.flash('success_msg', 'Successfully created observation.');
	res.redirect("/scout");
});

router.get('/', utils.ensureAuthenticated, function(req, res) {
	res.render('scout');
});

module.exports = router;