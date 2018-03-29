var mongoose = require('mongoose');
var mongoose_csv = require('mongoose-csv');
var observationForm = require('../observationForm');

var ObservationSchema = mongoose.Schema(observationForm.getObservationFormSchema());
ObservationSchema.plugin(mongoose_csv);

var Observation = module.exports = mongoose.model('Observation', ObservationSchema);

module.exports.createObservation = function(newObservation, callback) {
	newObservation.save(callback);
}