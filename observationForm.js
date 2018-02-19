// pull schema from here
// pull form structure from here
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
		placeholder: "Select a competition"
	},
	team: {
		type: Number,
		input: "dropdown",
		placeholder: "Select a team"
	},
	test_input: {
		type: String,
		input: "dropdown",
		data: {
			"key1": "Value 1",
			"key2": "Value 2"
		},
		placeholder: "This is a test placeholder!"
	}
}

function getObservationFormStructure() {
	var form = {};
	for (var key in observationFormSchema) {
		if ("data" in observationFormSchema[key]) {
			form[key] = {
				input: observationFormSchema[key].input,
				placeholder: observationFormSchema[key].placeholder,
				data: observationFormSchema[key].data
			}
		} else if (observationFormSchema[key].input != null) {
			form[key] = {
				input: observationFormSchema[key].input,
				placeholder: observationFormSchema[key].placeholder
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
	var finalString = '<form class="center-input" method="post" action="/scout/new">\n<div class="container center">\n<div class="row">';
	for (var category in payload) {
		if (category == "competition") {

		} else if (category == "team") {

		} else {
			if (payload[category].input == "dropdown") {
				finalString += '<select name="' + category + '">\n';
				finalString += '    <option value="" disabled selected>' + payload[category].placeholder + '</option>\n';
				for (var option in payload[category].data) {
					finalString += '    <option value="' + option + '">' + (payload[category].data)[option] + '</option>\n';
				}
				finalString += '</select>\n';
			} else if (payload[category].input == "multiple_choice") {
				// TODO
			} else if (payload[category].input == "long_text") {
				// TODO
			} else if (payload[category].input == "short_text") {
				// TODO
			} else if (payload[category].input == "checkbox") {
				// TODO
			} else if (payload[category].input == "number") {
				// TODO
			} else if (payload[category].input == "slider") {
				// TODO
			}
		}
	}
	finalString += '</div>\n</div>\n</form>';
	return finalString;
}

module.exports = {
	getObservationFormSchema: getObservationFormSchema,
	getObservationFormStructure: getObservationFormStructure,
	getObservationFormHandlebarsHelper: getObservationFormHandlebarsHelper
};