var multipliers = {
	'switch_cubes': 60,
	'scale_cubes': 100,
	'exchange_cubes': 35,
	'cubes_dropped': -20,
	'climbed': 150,
	'lifted': 350,
	'auton_drove_forward': 50,
	'auton_switch': 250, // TODO IF WE CAN DO IT, MAKE IT 13
	'auton_scale': 350,
	'death_percent': -1000,
	'speeds': 100
};

// ------------------------ FILTERS ------------------------ //
var switch_cubes = {
	'switch_cubes': 1,
	'scale_cubes': 0,
	'exchange_cubes': 0,
	'cubes_dropped': 0,
	'climbed': 0,
	'lifted': 0,
	'auton_drove_forward': 0,
	'auton_switch': 1,
	'auton_scale': 0,
	'death_percent': 0,
	'speeds': 0
};

var scale_cubes = {
	'switch_cubes': 0,
	'scale_cubes': 1,
	'exchange_cubes': 0,
	'cubes_dropped': 0,
	'climbed': 0,
	'lifted': 0,
	'auton_drove_forward': 0,
	'auton_switch': 0,
	'auton_scale': 1,
	'death_percent': 0,
	'speeds': 0
};

var exchange_cubes = {
	'switch_cubes': 0,
	'scale_cubes': 0,
	'exchange_cubes': 1,
	'cubes_dropped': 0,
	'climbed': 0,
	'lifted': 0,
	'auton_drove_forward': 0,
	'auton_switch': 0,
	'auton_scale': 0,
	'death_percent': 0,
	'speeds': 0
};

var climb = {
	'switch_cubes': 0,
	'scale_cubes': 0,
	'exchange_cubes': 0,
	'cubes_dropped': 0,
	'climbed': 1,
	'lifted': 0,
	'auton_drove_forward': 0,
	'auton_switch': 0,
	'auton_scale': 0,
	'death_percent': 0,
	'speeds': 0
};

var lift = {
	'switch_cubes': 0,
	'scale_cubes': 0,
	'exchange_cubes': 0,
	'cubes_dropped': 0,
	'climbed': 0,
	'lifted': 1,
	'auton_drove_forward': 0,
	'auton_switch': 0,
	'auton_scale': 0,
	'death_percent': 0,
	'speeds': 0
};

var speed = {
	'switch_cubes': 0,
	'scale_cubes': 0,
	'exchange_cubes': 0,
	'cubes_dropped': 0,
	'climbed': 0,
	'lifted': 0,
	'auton_drove_forward': 0,
	'auton_switch': 0,
	'auton_scale': 0,
	'death_percent': 0,
	'speeds': 10
};

var express = require('express');
var router = express.Router();
var Observation = require("../models/observation");
var utils = require("../utils");
var TBA = require("../TBA");
var observationForm = require("../observationForm.js");
var userlist = require("../userlist.js");

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
			if (time_robot_dead < 45) {
				if (!isNaN(parseInt(observations[observation]['teleop_switch_cubes']))) rankings[team]['switch_cubes'].push(parseInt(observations[observation]['teleop_switch_cubes']));
				if (!isNaN(parseInt(observations[observation]['teleop_scale_cubes']))) rankings[team]['scale_cubes'].push(parseInt(observations[observation]['teleop_scale_cubes']));
				if (!isNaN(parseInt(observations[observation]['teleop_cubes_dropped']))) rankings[team]['cubes_dropped'].push(parseInt(observations[observation]['teleop_cubes_dropped']));
				if (!isNaN(parseInt(observations[observation]['teleop_exchange_cubes']))) rankings[team]['exchange_cubes'].push(parseInt(observations[observation]['teleop_exchange_cubes']));
			}
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
					filter = switch_cubes;
					break;
				case "scale_cubes":
					filter = scale_cubes;
					break;
				case "exchange_cubes":
					filter = exchange_cubes;
					break;
				case "climb":
					filter = climb;
					break;
				case "lift":
					filter = lift;
					break;
				case "speed":
					filter = speed;
					break;
				case "undefined":
					filter = multipliers;
					break;
				default:
					filter = multipliers;
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