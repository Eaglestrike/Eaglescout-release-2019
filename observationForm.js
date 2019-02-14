var utils = require('./utils');
var TBA = require('./TBA');

/********************
* Types of inputs *
- null (no input)
- dropdown [requires data]
- short_text
- long_text
- multiple_choice [requires data]
- checkbox [requires data]
- number 
- increment_number 
- slider [requires data]
********************/

var rankingStructure = {
	place: {
		name: "Place",
		data: null
	},
	team: {
		name: "<span class='no-mobile'>Team </span>#",
		data: "team"
	},
	points: {
		name: "Points",
		data: "points"
	},
	image: {
		name: "Image",
		data: "image"
	}
}

var tableStructure = {
	team: {
		name: "<span class='no-mobile'>Team </span>#",
		data: "team"
	},
	more: {
		name: "More Info",
		data: {
			user: {
				name: "User",
				data: "user"
			},
			match: {
				name: "Match Number",
				data: "match"
			},
			sandstorm_hab_level: {
				name: "[Sandstorm] HAB Level",
				data: "sandstorm_hab_level"
			},
			sandstorm_hatches: {
				name: "[Sandstorm] Number of hatches placed",
				data: "sandstorm_hatches"
			},
			sandstorm_balls: {
				name: "[Sandstorm] Number of balls placed",
				data: "sandstorm_balls"
			},
			sandstorm_comments: {
				name: "[Sandstorm] Extra comments",
				data: "sandstorm_comments"
			},
			teleop_hatch_cargo: {
				name: "[Teleop] Hatches scored in cargo ship",
				data: "teleop_hatch_cargo"
			},
			teleop_hatch_bottom: {
				name: "[Teleop] Hatches scored in bottom of rocket",
				data: "teleop_hatch_bottom"
			},
			teleop_hatch_middle: {
				name: "[Teleop] Hatches scored in middle of rocket",
				data: "teleop_hatch_middle"
			},
			teleop_hatch_top: {
				name: "[Teleop] Hatches scored in top of rocket",
				data: "teleop_hatch_top"
			},
			teleop_ball_cargo: {
				name: "[Teleop] Balls scored in cargo ship",
				data: "teleop_ball_cargo"
			},
			teleop_ball_bottom: {
				name: "[Teleop] Balls scored in bottom of rocket",
				data: "teleop_ball_bottom"
			},
			teleop_ball_middle: {
				name: "[Teleop] Balls scored in middle of rocket",
				data: "teleop_ball_middle"
			},
			teleop_ball_top: {
				name: "[Teleop] Balls scored in top of rocket",
				data: "teleop_hatch_top"
			},
			teleop_robot_died: {
				name: "[Teleop] Robot died",
				data: "teleop_robot_died"
			},
			teleop_time_robot_died: {
				name: "[Teleop] How long robot was dead",
				data: "teleop_time_robot_died"
			},
			teleop_comments: {
				name: "[Teleop] Extra comments",
				data: "teleop_comments"
			},
			driver_comments: {
				name: "[Driver] Comments",
				data: "driver_comments"
			},
			time_on_defense: {
				name: "[Defense] Percent of time on defense",
				data: "time_on_defense"
			},
			intakes: {
				name: "[Bot] Intake types",
				data: "intakes"
			},
			speed: {
				name: "[Bot] Speed compared to our robot",
				data: "speed"
			},
			endgame_climb: {
				name: "[Endgame] Climb level",
				data: "endgame_climb"
			},
			endgame_help_others_climb: {
				name: "[Endgame] Helped other robots with climb",
				data: "endgame_help_others_climb"
			},
			endgame_comments: {
				name: "[Endgame] Extra comments",
				data: "endgame_comments"
			}
		}
	}
}

var observationFormSchema = {
	user: {
		type: String,
		input: null
	},
	competition: {
		type: String,
		input: "dropdown",
		placeholder: "Select a competition",
		title: "Current competition",
		subtitle: "If you're at a practice match, select \"Practice Match\""
	},
	match: {
		type: String,
		input: "number",
		placeholder: "Match number only",
		title: "Match Number",
		subtitle: "This is the number of the match that you are observing"
	},
	team: {
		type: String,
		input: "number",
		placeholder: "Team number only",
		title: "Team Number",
		subtitle: "This is the team number that you are observing"
	},
	sandstorm_hab_level: {
		type: String,
		input: "multiple_choice",
		data: {
			"level1": "Level 1",
			"level2": "Level 2",
			"level3": "Level 3",
			"level1_fail": "Level 1 (attempted and failed)",
			"level2_fail": "Level 2 (attempted and failed)",
			"level3_fail": "Level 3 (attempted and failed)",
			"fail": "Didn't move during sandstorm"
		},
		title: "[Sandstorm] HAB Level",
		subtitle: "What level did the robot leave off of the HAB and were they successful?"
	},
	sandstorm_hatches: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Sandstorm] Number of hatches placed",
		subtitle: "How many hatches did they score during teleop?"
	},
	sandstorm_balls: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Sandstorm] Number of balls placed",
		subtitle: "How many balls did they score during teleop?"
	},
	sandstorm_comments: {
		type: String,
		input: "long_text",
		title: "[Sandstorm] Extra comments",
		subtitle: "Write anything that might be noteworthy about the sandstorm period here."
	},
	teleop_hatch_cargo: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] Hatches scored in cargo ship",
		subtitle: "How many hatches did they score on the cargo ship during teleop?"
	},
	teleop_hatch_bottom: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] Hatches scored in bottom of rocket",
		subtitle: "How many hatches did they score on the bottom of the rocket during teleop?"
	},
	teleop_hatch_middle: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] Hatches scored in middle of rocket",
		subtitle: "How many hatches did they score on the middle of the rocket during teleop?"
	},
	teleop_hatch_top: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] Hatches scored in top of rocket",
		subtitle: "How many hatches did they score on the top of the rocket during teleop?"
	},
	teleop_ball_cargo: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] Balls scored in cargo ship",
		subtitle: "How many balls did they score in the cargo ship during teleop?"
	},
	teleop_ball_bottom: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] Balls scored in bottom of rocket",
		subtitle: "How many balls did they score in the bottom of the rocket during teleop?"
	},
	teleop_ball_middle: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] Balls scored in middle of rocket",
		subtitle: "How many balls did they score in the middle of the rocket during teleop?"
	},
	teleop_ball_top: {
		type: String,
		input: "increment_number",
		placeholder: "Number only",
		title: "[Teleop] Balls scored in top of rocket",
		subtitle: "How many balls did they score in the top of the rocket during teleop?"
	},
	teleop_robot_died: {
		type: String,
		input: "multiple_choice",
		data: {
			"yes": "Yes",
			"no": "No"
		},
		title: "[Teleop] Did the robot die?",
		subtitle: "If they did, note the time of death for the next question"
	},
	teleop_time_robot_died: {
		type: String,
		input: "number",
		placeholder: "Format: number of seconds only",
		title: "[Teleop] Amount of time that robot was dead",
		subtitle: "If the robot didn't die, leave this blank"
	},
	teleop_comments: {
		type: String,
		input: "long_text",
		title: "[Teleop] Extra comments",
		subtitle: "Write anything that might be noteworthy about teleop here."
	},
	driver_comments: {
		type: String,
		input: "long_text",
		title: "[Driver] Comments about the driver",
		subtitle: "Put comments about how much the driver is in control of the robot here. How skilled is the driver?"
	},
	time_on_defense: {
		type: String,
		input: "slider",
		data: {
			"min": 0,
			"max": 100
		},
		title: "[Defense] Percent of time on defense",
		subtitle: "Approximate percent of time on defense"
	},
	intakes: {
		type: String,
		input: "checkbox",
		placeholder: "Select all that apply",
		data: {
			"hatch": "Hatch intake",
			"ball_ground": "Ball ground intake",
			"ball_player_intake": "Ball player station intake"
		},
		title: "[Bot] Intake types",
		subtitle: "Check all intakes that the robot has."
	},
	speed: {
		type: String,
		input: "dropdown",
		data: {
			"slow": "Slow (lower than 8 ft/second)",
			"medium": "Medium (8 ft/second to 15 ft/second)",
			"fast": "Fast (greater than 15 ft/second)",
		},
		placeholder: "Select one",
		title: "[Bot] Speed compared to our robot (16 ft/second)",
		subtitle: "Approximate this if you can"
	},
	endgame_climb: {
		type: String,
		input: "multiple_choice",
		data: {
			"level1": "Level 1",
			"level2": "Level 2",
			"level3": "Level 3",
			"level1_fail": "Level 1 (attempted and failed)",
			"level2_fail": "Level 2 (attempted and failed)",
			"level3_fail": "Level 3 (attempted and failed)",
			"fail": "Didn't attempt to climb",
			"assisted": "Was assisted to climb"
		},
		title: "[Endgame] Climb level",
		subtitle: "Which of the following applies to the robot at the end of the game?"
	},
	endgame_help_others_climb: {
		type: String,
		input: "long_text",
		title: "[Endgame] Helped other robots climb",
		subtitle: "If the robot was able to assist climbing, describe exactly what they attempted and whether or not they were successful."
	},
	endgame_comments: {
		type: String,
		input: "long_text",
		title: "[Endgame] Any extra comments about the end of the game?",
		subtitle: "Put anything that would be noteworthy about the end of the game here."
	}
}

function getObservationFormStructure() {
	var form = {};
	for (var key in observationFormSchema) {
		if ("data" in observationFormSchema[key]) {
			form[key] = {
				input: observationFormSchema[key].input,
				placeholder: observationFormSchema[key].placeholder,
				data: observationFormSchema[key].data,
				title: observationFormSchema[key].title,
				subtitle: observationFormSchema[key].subtitle
			}
		} else if (observationFormSchema[key].input != null) {
			form[key] = {
				input: observationFormSchema[key].input,
				placeholder: observationFormSchema[key].placeholder,
				title: observationFormSchema[key].title,
				subtitle: observationFormSchema[key].subtitle
			}
		}
	}
	return form;
}

function getObservationFormSchema() {
	var schema = {};
	for (var key in observationFormSchema) {
		schema[key] = {
			type: observationFormSchema[key].type
		};
	}
	return schema;
}

function getObservationFormHandlebarsHelper(structure, options) {
	var id = 0;

	var finalString = '<form method="post" action="/scout/new">\n<div class="container">\n<div class="row">';
	for (var category in structure) {
		if (category == "events") continue;
		finalString += '<p>';
		finalString += '<b>' + structure[category].title + '</b>\n<br>\n' + structure[category].subtitle + '\n';
		finalString += '</p>';
		if (category == "competition") {
			finalString += '<select name="competition">\n';
			finalString += '<option value="" disabled ' + (utils.getCurrentEvent() == null ? 'selected' : '') + '>Choose event from list</option>\n';
			for (var event in structure.events) {
				finalString += '<option value="' + structure.events[event]["key"] + '"' + (structure.events[event]["current"] ? ' selected' : '') + '>' + structure.events[event]["name"] + '</option>\n';
			}
			finalString += '</select>\n';
		} else {
			if (structure[category].input == "dropdown") {
				finalString += '<select name="' + category + '">\n';
				finalString += '<option value="" disabled selected>' + structure[category].placeholder + '</option>\n';
				for (var option in structure[category].data) {
					finalString += '<option value="' + option + '">' + (structure[category].data)[option] + '</option>\n';
				}
				finalString += '</select>\n';
			} else if (structure[category].input == "multiple_choice") {
				for (var option in structure[category].data) {
					finalString += '<p>\n';
      				finalString += '<input class="with-gap" name="' + category + '" value="' + option + '" type="radio" id="' + option + '_' + id + '" />\n';
      				finalString += '<label for="' + option + '_' + (id ++) + '">' + (structure[category].data)[option] + '</label>\n';
      				finalString += '</p>\n';
      			}
			} else if (structure[category].input == "long_text") {
				finalString += '<div class="input-field">\n';
				finalString += '<textarea name="' + category + '" class="materialize-textarea"></textarea>\n';
          		finalString += '<label for="' + category + '">Message</label>\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "short_text") {
				finalString += '<div class="input-field">\n';
				finalString += '<input placeholder="' + structure[category].placeholder + '" name="' + category + '" type="text">\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "checkbox") {
				finalString += '<select name="' + category + '" multiple>\n';
				finalString += '<option value="" disabled selected>' + structure[category].placeholder + '</option>\n';
				for (var option in structure[category].data) {
					finalString += '<option value="' + option + '">' + (structure[category].data)[option] + '</option>\n';
				}
				finalString += '</select>\n';
			} else if (structure[category].input == "number") {
				finalString += '<div class="input-field">\n';
				finalString += '<input class="validate" placeholder="' + structure[category].placeholder + '" name="' + category + '" type="number">\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "increment_number") {
				finalString += '<div class="input-field row">\n';
				finalString += '<a class="waves-effect light-blue darken-3 waves-light btn increment_number_minus_button col s2" data-for="' + category + '">-</a>';
				finalString += '<div class="col s1"></div>';
				finalString += '<input class="validate increment_number col s6" placeholder="' + structure[category].placeholder + '" name="' + category + '" type="number" value="0">\n';
				finalString += '<div class="col s1"></div>';
				finalString += '<a class="waves-effect light-blue darken-3 waves-light btn increment_number_plus_button col s2" data-for="' + category + '">+</a>';
          		finalString += '</div>\n';
			} else if (structure[category].input == "slider") {
				finalString += '<p class="range-field">';
			    finalString += '<input type="range" name="' + category + '" min="' + (structure[category].data)["min"] + '" max="' + (structure[category].data)["max"] + '" />';
			    finalString += '</p>';
			}
		}
		finalString += '<br>';
	}
	finalString += '</div>\n</div>\n<div class="center">\n<button class="btn waves-effect waves-light green" type="submit" name="action">Submit</button>\n</div>\n</form>';
	return finalString;
}

function getEditObservationHandlebarsHelper(observation, structure, observationID, options) {
	var id = 0;

	var finalString = '<form method="post" action="/scout/saveobservation/' + observationID + '">\n<div class="container">\n<div class="row">';
	for (var category in structure) {
		if (category == "events") continue;
		finalString += '<p>';
		finalString += '<b>' + structure[category].title + '</b>\n<br>\n' + structure[category].subtitle + '\n';
		finalString += '</p>';
		if (category == "competition") {
			finalString += '<select name="competition">\n';
			finalString += '<option value="" disabled ' + (utils.getCurrentEvent() == null ? 'selected' : '') + '>Choose event from list</option>\n';
			for (var event in structure.events) {
				finalString += '<option value="' + structure.events[event]["key"] + '"' + (structure.events[event]["key"] == observation[category] ? ' selected' : '') + '>' + structure.events[event]["name"] + '</option>\n';
			}
			finalString += '</select>\n';
		} else {
			if (structure[category].input == "dropdown") {
				finalString += '<select name="' + category + '">\n';
				finalString += '<option value="" disabled selected>' + structure[category].placeholder + '</option>\n';
				for (var option in structure[category].data) {
					finalString += '<option value="' + option + '"' + (option == observation[category] ? ' selected' : '') + '>' + (structure[category].data)[option] + '</option>\n';
				}
				finalString += '</select>\n';
			} else if (structure[category].input == "multiple_choice") {
				for (var option in structure[category].data) {
					finalString += '<p>\n';
      				finalString += '<input class="with-gap" name="' + category + '" value="' + option + '" type="radio" id="' + option + '_' + id + '"' + (option == observation[category] ? ' checked' : '') + ' />\n';
      				finalString += '<label for="' + option + '_' + (id ++) + '">' + (structure[category].data)[option] + '</label>\n';
      				finalString += '</p>\n';
      			}
			} else if (structure[category].input == "long_text") {
				finalString += '<div class="input-field">\n';
				finalString += '<textarea name="' + category + '" class="materialize-textarea">' + observation[category] + '</textarea>\n';
          		finalString += '<label for="' + category + '">Message</label>\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "short_text") {
				finalString += '<div class="input-field">\n';
				finalString += '<input placeholder="' + structure[category].placeholder + '" name="' + category + '" type="text" value="' + observation[category] + '">\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "checkbox") {
				finalString += '<select name="' + category + '" multiple>\n';
				finalString += '<option value="" disabled selected>' + structure[category].placeholder + '</option>\n';
				for (var option in structure[category].data) {
					finalString += '<option value="' + option + '"' + (observation[category].split(",").includes(option) ? ' selected' : '') + '>' + (structure[category].data)[option] + '</option>\n';
				}
				finalString += '</select>\n';
			} else if (structure[category].input == "number") {
				finalString += '<div class="input-field">\n';
				finalString += '<input class="validate" placeholder="' + structure[category].placeholder + '" name="' + category + '" type="number" value="' + observation[category] + '">\n';
          		finalString += '</div>\n';
			} else if (structure[category].input == "increment_number") {
				finalString += '<div class="input-field row">\n';
				finalString += '<a class="waves-effect light-blue darken-3 waves-light btn increment_number_minus_button col s2" data-for="' + category + '">-</a>';
				finalString += '<div class="col s1"></div>';
				finalString += '<input class="validate increment_number col s6" placeholder="' + structure[category].placeholder + '" name="' + category + '" type="number" value="' + observation[category] + '">\n';
				finalString += '<div class="col s1"></div>';
				finalString += '<a class="waves-effect light-blue darken-3 waves-light btn increment_number_plus_button col s2" data-for="' + category + '">+</a>';
          		finalString += '</div>\n';
			} else if (structure[category].input == "slider") {
				finalString += '<p class="range-field">';
			    finalString += '<input type="range" name="' + category + '" min="' + (structure[category].data)["min"] + '" max="' + (structure[category].data)["max"] + '" value="' + observation[category] + '" />';
			    finalString += '</p>';
			}
		}
		finalString += '<br>';
	}
	finalString += '</div>\n</div>\n<div class="center">\n<button class="btn waves-effect waves-light green" type="submit" name="action">Submit</button>\n</div>\n</form>';
	return finalString;
}

function getTableHandlebarsHelper(structure, res, options) {
	var finalString = "<table class='bordered'>\n<thead>\n";
	for (var category in tableStructure) finalString += "<th>" + tableStructure[category]["name"] + "</th>\n";
	finalString += "<th>Edit</th>\n";
	finalString += "<th>Delete</th>\n";
	finalString += "</thead>\n";
	for (var observation in structure) {
		finalString += "<tr>";
		for (var category in tableStructure) {
			var data = tableStructure[category]["data"];
			if (typeof data == 'object') {
				finalString += "<td>";
				for (var subcategory in data) {
					var data_subcategory = tableStructure[category]["data"][subcategory]["data"];
					var display = structure[observation][data_subcategory];
					if (display == null || display == "" || display == "undefined" || display == "NaN") continue;
					if (observationFormSchema[subcategory]["input"] == "checkbox") {
						var selectedChecks = display.split(",");
						var checkboxFinalString = "";
						for (var item in selectedChecks) {
							checkboxFinalString += observationFormSchema[subcategory]["data"][selectedChecks[item]] + ", ";
						}
						checkboxFinalString = checkboxFinalString.substring(0, checkboxFinalString.length - 2);
						display = checkboxFinalString;
					} else if ("data" in observationFormSchema[subcategory] && observationFormSchema[subcategory]["input"] !== "slider") {
						display = observationFormSchema[subcategory]["data"][display];
					}
					finalString += "<b>" + tableStructure[category]["data"][subcategory]["name"] + ": </b>" + display + "</b><br>";
				}
				finalString += "</td>";
			} else {
				finalString += "<td>" + structure[observation][data] + "</td>";
			}
		}
		finalString += "<td><a class='waves-effect waves-light btn-large light-blue" + (res.locals.user.admin || res.locals.user.email == structure[observation]["user"] ? "" : " disabled") + "' href='/scout/editobservation/" + structure[observation]["_id"] + "'><i class='material-icons'>create</i></a></td>";
		finalString += "<td><a class='waves-effect waves-light btn-large red modal-trigger open-modal" + (res.locals.user.admin || res.locals.user.email == structure[observation]["user"] ? "" : " disabled") + "' href='#confirm-delete-modal' data-id='" + structure[observation]["_id"] + "'><i class='material-icons'>delete</i></a></td>";
		finalString += "</tr>";
	}
	finalString += "</table>";
	return finalString;
}

function getRankingHandlebarsHelper(structure, options) {
	var finalString = "<table class='bordered'>\n<thead>\n";
	for (var category in rankingStructure) finalString += "<th" + (category == "image" ? " class='no-mobile'" : '') + ">" + rankingStructure[category]["name"] + "</th>\n";
	for (var observation in structure) {
		finalString += "<tr>";
		for (var category in rankingStructure) {
			if (category == "place") {
				finalString += "<td>" + (parseInt(observation) + 1) + "</td>";
				continue;
			}
			var data = rankingStructure[category]["data"];
			if (category == "image") finalString += "<td class='no-mobile'>" + (structure[observation][data] == null ? "none" : "<a href='" + structure[observation][data] + "' target='_blank'><img src='" + structure[observation][data] + "' style='height: 200px'></img></a>") + "</td>";
			else finalString += "<td>" + structure[observation][data] + "</td>";
		}
		finalString += "</tr>";
	}
	finalString += "</thead>\n";
	finalString += "</table>";
	return finalString;
}

module.exports = {
	getObservationFormSchema: getObservationFormSchema,
	getObservationFormStructure: getObservationFormStructure,
	getObservationFormHandlebarsHelper: getObservationFormHandlebarsHelper,
	getEditObservationHandlebarsHelper: getEditObservationHandlebarsHelper,
	getTableHandlebarsHelper: getTableHandlebarsHelper,
	getRankingHandlebarsHelper: getRankingHandlebarsHelper
};