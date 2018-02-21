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
		input: "dropdown",
		placeholder: "Select a team",
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

function getObservationFormHandlebarsHelper(payload, options) {
	var finalString = '<form method="post" action="/scout/new">\n<div class="container">\n<div class="row">';
	for (var category in payload) {
		finalString += '<p>';
		finalString += '<b>' + payload[category].title + '</b>\n<br>\n' + payload[category].subtitle + '\n';
		finalString += '</p>';
		if (category == "competition") {

		} else if (category == "team") {

		} else {
			if (payload[category].input == "dropdown") {
				finalString += '<select name="' + category + '">\n';
				finalString += '<option value="" disabled selected>' + payload[category].placeholder + '</option>\n';
				for (var option in payload[category].data) {
					finalString += '<option value="' + option + '">' + (payload[category].data)[option] + '</option>\n';
				}
				finalString += '</select>\n';
			} else if (payload[category].input == "multiple_choice") {
				for (var option in payload[category].data) {
					finalString += '<p>\n';
      				finalString += '<input class="with-gap" name="' + category + '" type="radio" id="' + option + '" />\n';
      				finalString += '<label for="' + option + '">' + (payload[category].data)[option] + '</label>\n';
      				finalString += '</p>\n';
      			}
			} else if (payload[category].input == "long_text") {
				finalString += '<div class="input-field">\n';
				finalString += '<textarea id="' + category + '" class="materialize-textarea"></textarea>\n';
          		finalString += '<label for="' + category + '">Message</label>\n';
          		finalString += '</div>\n';
			} else if (payload[category].input == "short_text") {
				finalString += '<div class="input-field">\n';
				finalString += '<input placeholder="' + payload[category].placeholder + '" id="' + category + '" type="text">\n';
          		finalString += '</div>\n';
			} else if (payload[category].input == "checkbox") {
				for (var option in payload[category].data) {
					finalString += '<p>\n';
      				finalString += '<input type="checkbox" class="filled-in" name="' + category + '" id="' + option + '" />\n';
      				finalString += '<label for="' + option + '">' + (payload[category].data)[option] + '</label>\n';
      				finalString += '</p>\n';
      			}
			} else if (payload[category].input == "number") {
				finalString += '<div class="input-field">\n';
				finalString += '<input class="validate" placeholder="' + payload[category].placeholder + '" id="' + category + '" type="number">\n';
          		finalString += '</div>\n';
			} else if (payload[category].input == "slider") {
				finalString += '<p class="range-field">';
			    finalString += '<input type="range" id="' + category + '" min="' + (payload[category].data)["min"] + '" max="' + (payload[category].data)["max"] + '" />';
			    finalString += '</p>';
			}
		}
		finalString += '<br>';
	}
	finalString += '</div>\n</div>\n</form>';
	return finalString;
}

module.exports = {
	getObservationFormSchema: getObservationFormSchema,
	getObservationFormStructure: getObservationFormStructure,
	getObservationFormHandlebarsHelper: getObservationFormHandlebarsHelper
};