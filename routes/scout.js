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
			observations: observations,
			res: res
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
					'hab_level': [],
					'hab_level_fail': [],
					'sandstorm_hatches': [],
					'sandstorm_balls': [],
					'teleop_hatch_cargo': [],
					'teleop_hatch_bottom': [],
					'teleop_hatch_middle': [],
					'teleop_hatch_top': [],
					'teleop_ball_cargo': [],
					'teleop_ball_bottom': [],
					'teleop_ball_middle': [],
					'teleop_ball_top': [],
					'hatch_intake': false,
					'hatch_ground_intake': false,
					'ball_ground_intake': false,
					'ball_player_intake': false,
					'speeds': [],
					'climb_level': [],
					'climb_level_fail': [],
					'climb_assist': [],
					'death_percent': []
				};
			}
			var time_robot_dead = observations[observation]['teleop_time_robot_died'] == "" ? 0 : parseInt(observations[observation]['teleop_time_robot_died']);
			rankings[team]['death_percent'].push(time_robot_dead / 150);

			var hab_level = 0;
			var hab_level_fail = 0;
			switch (observations[observation]['sandstorm_hab_level']) {
				case "level1": 
				hab_level = 1;
				break;
				case "level2": 
				hab_level = 2;
				break;
				case "level1_fail": 
				hab_level_fail = 1;
				break;
				case "level2_fail": 
				hab_level_fail = 2;
				break;
			}
			rankings[team]['hab_level'].push(hab_level);
			rankings[team]['hab_level_fail'].push(hab_level_fail);

			if (!isNaN(parseInt(observations[observation]['sandstorm_hatches']))) rankings[team]['sandstorm_hatches'].push(parseInt(observations[observation]['sandstorm_hatches']));
			if (!isNaN(parseInt(observations[observation]['sandstorm_balls']))) rankings[team]['sandstorm_balls'].push(parseInt(observations[observation]['sandstorm_balls']));
			if (!isNaN(parseInt(observations[observation]['teleop_hatch_cargo']))) rankings[team]['teleop_hatch_cargo'].push(parseInt(observations[observation]['teleop_hatch_cargo']));
			if (!isNaN(parseInt(observations[observation]['teleop_hatch_bottom']))) rankings[team]['teleop_hatch_bottom'].push(parseInt(observations[observation]['teleop_hatch_bottom']));
			if (!isNaN(parseInt(observations[observation]['teleop_hatch_middle']))) rankings[team]['teleop_hatch_middle'].push(parseInt(observations[observation]['teleop_hatch_middle']));
			if (!isNaN(parseInt(observations[observation]['teleop_hatch_top']))) rankings[team]['teleop_hatch_top'].push(parseInt(observations[observation]['teleop_hatch_top']));
			if (!isNaN(parseInt(observations[observation]['teleop_ball_cargo']))) rankings[team]['teleop_ball_cargo'].push(parseInt(observations[observation]['teleop_ball_cargo']));
			if (!isNaN(parseInt(observations[observation]['teleop_ball_bottom']))) rankings[team]['teleop_ball_bottom'].push(parseInt(observations[observation]['teleop_ball_bottom']));
			if (!isNaN(parseInt(observations[observation]['teleop_ball_middle']))) rankings[team]['teleop_ball_middle'].push(parseInt(observations[observation]['teleop_ball_middle']));
			if (!isNaN(parseInt(observations[observation]['teleop_ball_top']))) rankings[team]['teleop_ball_top'].push(parseInt(observations[observation]['teleop_ball_top']));

			rankings[team]['hatch_intake'] = false;
			rankings[team]['hatch_ground_intake'] = false;
			rankings[team]['ball_ground_intake'] = false;
			rankings[team]['ball_player_intake'] = false;

			if (observations[observation]['intakes'] !== undefined) {
				var intakes_array = observations[observation]['intakes'].split(",");
				rankings[team]['hatch_intake'] = intakes_array.includes("hatch");
				rankings[team]['hatch_ground_intake'] = intakes_array.includes("hatch_ground");
				rankings[team]['ball_ground_intake'] = intakes_array.includes("ball_ground");
				rankings[team]['ball_player_intake'] = intakes_array.includes("ball_player");
			}

			var climb_level = 0;
			var climb_level_fail = 0;
			switch (observations[observation]['endgame_climb']) {
				case "level1":
				climb_level = 1;
				break;
				case "level2": 
				climb_level = 2;
				break;
				case "level3": 
				climb_level = 3;
				break;
				case "level1_fail": 
				climb_level_fail = 1;
				break;
				case "level2_fail": 
				climb_level_fail = 2;
				break;
				case "level3_fail": 
				climb_level_fail = 3;
				break;
			}
			rankings[team]['climb_level'].push(climb_level);
			rankings[team]['climb_level_fail'].push(climb_level_fail);

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

			var assist;
			switch (observations[observation]['endgame_can_assist']) {
				case "yes": 
				assist = 2;
				break;
				case "attempted": 
				assist = 1;
				break;
				case "no": 
				assist = 0;
				break;
			}
			rankings[team]['climb_assist'].push(assist);
		}

		var points = [];
		for (var ranking in rankings) {
			var filter;
			switch (req.query.filter) {
				case "hab_level":
					filter = filters.hab_level;
					break;
				case "hatches":
					filter = filters.hatches;
					break;
				case "balls":
					filter = filters.balls;
					break;
				case "intakes":
					filter = filters.intakes;
					break;
				case "speeds":
					filter = filters.speeds;
					break;
				case "climb":
					filter = filters.climb;
					break;
				case "assist":
					filter = filters.assist;
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
					hab_level: req.query.filter == "hab_level",
					hatches: req.query.filter == "hatches",
					balls: req.query.filter == "balls",
					intakes: req.query.filter == "intakes",
					speeds: req.query.filter == "speeds",
					climb: req.query.filter == "climb"
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

router.get('/editobservation/:id', utils.ensureAuthenticated, function(req, res) {
	if (res.locals.user.admin) {
		Observation.findOne({
			"_id": req.params.id
		}, function(err, observation) {
			if (err || observation == null) {
				req.flash('error_msg', 'Unknown observation ID!');
				res.redirect('/scout/list');
				return;
			}
			TBA.getEvents((events) => {
				var structure = observationForm.getObservationFormStructure();
				structure.events = events;
				res.render('editobservation', {
					observationID: req.params.id,
					observation: observation,
					structure: structure
				});
			});
		});
	} else {
		Observation.findOne({
			"_id": req.params.id,
			user: res.locals.user.email
		}, function(err, observation) {
			if (err || observation == null) {
				req.flash('error_msg', 'Insufficient permissions OR unknown observation ID!');
				res.redirect('/scout/list');
				return;
			}
			TBA.getEvents((events) => {
				var structure = observationForm.getObservationFormStructure();
				structure.events = events;
				res.render('editobservation', {
					observationID: req.params.id,
					observation: observation,
					structure: structure
				});
			});
		});
	}
});

router.get('/delobservation/:id', utils.ensureAuthenticated, function(req, res) {
	if (res.locals.user.admin) {
		Observation.findOneAndRemove({
			"_id": req.params.id
		}, function(err, observation) {
			if (err || observation == null) {
				req.flash('error_msg', 'Unknown observation ID!');
			}
			res.redirect('/scout/list');
		});
	} else {
		Observation.findOneAndRemove({
			"_id": req.params.id,
			user: res.locals.user.email
		}, function(err, observation) {
			if (err || observation == null) {
				req.flash('error_msg', 'Insufficient permissions OR unknown observation ID!');
			}
			res.redirect('/scout/list');
		});
	}
});

router.post('/saveobservation/:id', utils.ensureAuthenticated, function(req, res) {
	req.body.user = res.locals.user.email;
	delete req.body.action;

	console.log(req.body);

	Observation.findOneAndUpdate({
		"_id": req.params.id
	}, req.body, function (err) {
		if (err) throw err;

		req.flash('success_msg', 'Successfully saved observation.');
		res.redirect("/scout/list");
	});
});

router.get('/', utils.ensureAuthenticated, function(req, res) {
	res.render('scout');
});

module.exports = router;