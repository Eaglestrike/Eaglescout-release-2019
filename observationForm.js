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
			match: {
				name: "Match Number",
				data: "match"
			},
			auto_cross_line: {
				name: "[Auto] Crossed auto line",
				data: "auto_cross_line"
			},
			auto_scale_cubes: {
				name: "[Auto] Bot put cubes on scale",
				data: "auto_scale_cubes"
			},
			auto_switch_cubes: {
				name: "[Auto] Bot put cubes on switch",
				data: "auto_switch_cubes"
			},
			auto_comments: {
				name: "[Auto] Extra comments",
				data: "auto_comments"
			},
			teleop_scale_cubes: {
				name: "[Teleop] Number of cubes on scale",
				data: "teleop_scale_cubes"
			},
			teleop_switch_cubes: {
				name: "[Teleop] Number of cubes on switch",
				data: "teleop_switch_cubes"
			},
			teleop_exchange_cubes: {
				name: "[Teleop] Number of cubes put in the exchange",
				data: "teleop_exchange_cubes"
			},
			teleop_cubes_dropped: {
				name: "[Teleop] Number of cubes dropped",
				data: "teleop_cubes_dropped"
			},
			teleop_robot_died: {
				name: "[Teleop] Robot died",
				data: "teleop_robot_died"
			},
			teleop_time_robot_died: {
				name: "[Teleop] How long robot was dead",
				data: "teleop_time_robot_died"
			},
			driver_comments: {
				name: "[Driver] Comments",
				data: "driver_comments"
			},
			time_on_defense: {
				name: "[Defense] Percent of time on defense",
				data: "time_on_defense"
			},
			speed: {
				name: "[Bot] Speed compared to our robot",
				data: "speed"
			},
			endgame_successful_climb: {
				name: "[Endgame] Successful climb",
				data: "endgame_successful_climb"
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
	auto_cross_line: {
		type: String,
		input: "multiple_choice",
		data: {
			"yes": "Yes",
			"no": "No"
		},
		title: "[Auto] Crossed auto line?",
		subtitle: "Did the bot cross the auto line during auto?"
	},
	auto_scale_cubes: {
		type: String,
		input: "multiple_choice",
		data: {
			"yes": "Yes",
			"no": "No",
			"attempted": "Attempted and failed"
		},
		title: "[Auto] Did the bot put cubes on scale?",
		subtitle: "Did the bot put cubes on the scale during auto?"
	},
	auto_switch_cubes: {
		type: String,
		input: "multiple_choice",
		data: {
			"yes": "Yes",
			"no": "No",
			"attempted": "Attempted and failed"
		},
		title: "[Auto] Did the bot put cubes on switch?",
		subtitle: "Did the bot put cubes on the switch during auto?"
	},
	auto_comments: {
		type: String,
		input: "long_text",
		title: "[Auto] Any extra comments about auto?",
		subtitle: "Put anything that would be noteworthy about auto here."
	},
	teleop_scale_cubes: {
		type: String,
		input: "number",
		placeholder: "Number only",
		title: "[Teleop] Number of cubes on scale",
		subtitle: "Put the number of cubes they put on the scale here"
	},
	teleop_switch_cubes: {
		type: String,
		input: "number",
		placeholder: "Number only",
		title: "[Teleop] Number of cubes on switch",
		subtitle: "Put the number of cubes they put on the switch here"
	},
	teleop_exchange_cubes: {
		type: String,
		input: "number",
		placeholder: "Number only",
		title: "[Teleop] Number of cubes put in the exchange",
		subtitle: "Put the number of cubes they put int the exchange/vault here"
	},
	teleop_cubes_dropped: {
		type: String,
		input: "number",
		placeholder: "Number only",
		title: "[Teleop] Number of cubes dropped",
		subtitle: "Put the number of cubes that the robot dropped here"
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
	endgame_successful_climb: {
		type: String,
		input: "multiple_choice",
		data: {
			"yes": "Yes",
			"no": "No",
			"attempted": "Attempted and failed"
		},
		title: "[Endgame] Successful climb?",
		subtitle: "Did the robot climb successfully?"
	},
	endgame_help_others_climb: {
		type: String,
		input: "multiple_choice",
		data: {
			"yes": "Yes",
			"no": "No",
			"attempted": "Attempted and failed"
		},
		title: "[Endgame] Helped other robots with climb with a bar?",
		subtitle: "Did the robot help other robots climb successfully?"
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

function getTableHandlebarsHelper(structure, options) {
	var finalString = "<table class='bordered'>\n<thead>\n";
	for (var category in tableStructure) finalString += "<th>" + tableStructure[category]["name"] + "</th>\n";
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
					if ("data" in observationFormSchema[subcategory] && observationFormSchema[subcategory]["input"] !== "slider") display = observationFormSchema[subcategory]["data"][display];
					finalString += "<b>" + tableStructure[category]["data"][subcategory]["name"] + ": </b>" + display + "</b><br>";
				}
				finalString += "</td>";
			} else {
				finalString += "<td>" + structure[observation][data] + "</td>";
			}
		}
		finalString += "</tr>";
	}
	finalString += "</thead>\n";
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
	getTableHandlebarsHelper: getTableHandlebarsHelper,
	getRankingHandlebarsHelper: getRankingHandlebarsHelper
};