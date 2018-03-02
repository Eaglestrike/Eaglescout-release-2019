var utils = require('./utils');
var TBA = require('./TBA');
// be able to handle submission of forms

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
	team: {
		type: String,
		input: "number",
		placeholder: "Team number only",
		title: "Team Number",
		subtitle: "This is the team number that you are observing"
	},
	test_dropdown: {
		type: String,
		input: "dropdown",
		data: {
			"key1": "Value 1",
			"key2": "Value 2"
		},
		placeholder: "This is a test!",
		title: "Test for dropdown",
		subtitle: "This is subtitle for dropdown"
	},
	test_mult: {
		type: String,
		input: "multiple_choice",
		data: {
			"key1": "Value 1",
			"key2": "Value 2"
		},
		title: "Test for multiple choice",
		subtitle: "This is subtitle for multiple choice"
	},
	test_long_text: {
		type: String,
		input: "long_text",
		title: "Test for long text",
		subtitle: "This is subtitle for long text"
	},
	test_short_text: {
		type: String,
		input: "short_text",
		placeholder: "This is a placeholder",
		title: "Test for short text",
		subtitle: "This is subtitle for short text"
	},
	test_checkbox: {
		type: String,
		input: "checkbox",
		data: {
			"check1": "Check 1",
			"check2": "Check 2",
			"check3": "Check 3",
			"check4": "Check 4"
		},
		title: "Test for checkbox",
		subtitle: "This is subtitle for checkbox"
	},
	test_number: {
		type: String,
		input: "number",
		placeholder: "This is a number",
		title: "Test for number",
		subtitle: "This is subtitle for number"
	},
	test_slider: {
		type: String,
		input: "slider",
		data: {
			"min": 90,
			"max": 100
		},
		placeholder: "This is a slider",
		title: "Test for slider",
		subtitle: "This is subtitle for slider"
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
      				finalString += '<input class="with-gap" name="' + category + '" type="radio" id="' + option + '" />\n';
      				finalString += '<label for="' + option + '">' + (structure[category].data)[option] + '</label>\n';
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
				for (var option in structure[category].data) {
					finalString += '<p>\n';
      				finalString += '<input type="checkbox" class="filled-in" name="' + category + '" id="' + option + '" />\n';
      				finalString += '<label for="' + option + '">' + (structure[category].data)[option] + '</label>\n';
      				finalString += '</p>\n';
      			}
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

module.exports = {
	getObservationFormSchema: getObservationFormSchema,
	getObservationFormStructure: getObservationFormStructure,
	getObservationFormHandlebarsHelper: getObservationFormHandlebarsHelper
};