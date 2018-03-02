var mongoose = require('mongoose');
var observationForm = require('../observationForm');

var ObservationSchema = mongoose.Schema(observationForm.getObservationFormSchema());

var Observation = module.exports = mongoose.model('Observation', ObservationSchema);

module.exports.createObservation = function(newObservation, callback) {
	newObservation.save(callback);
}