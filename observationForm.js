// pull schema from here
// pull form structure from here
// be able to handle submission of forms

/********************
 * Types of inputs *
 - null (no input)
 - dropdown
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
		type: String
		input: "dropdown"
	},
	team: {
		type: Number,
		input: "dropdown"
	},
	test_input: {
		type: String,
		input: "multiple_choice",
		data: ["test1", "test2"]
	}
}

module.exports = {
	getObservationFormSchema: function() {
		var schema = {};
		for (var key in observationFormSchema) {
			schema[key] = {
				type: observationFormSchema[key].type
			};
		}
		return schema;
	},
	getObservationFormStructure: function() {
		var form = {};
		for (var key in observationFormSchema) {
			if ("data" in observationFormSchema[key]) {
				form[key] = {
					input: observationFormSchema[key].input,
					data: observationFormSchema[key].input
				}
			} else {
				form[key] = {
					input: observationFormSchema[key].input
				}
			}
		}
	}
};