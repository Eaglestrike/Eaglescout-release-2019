var mongoose = require('mongoose');
var config = require('../config');

var ObservationSchema = mongoose.Schema(config.observationStructure);

var Observation = module.exports = mongoose.model('Observation', ObservationSchema);

module.exports.createObservation = function(newObservation, callback) {
	newObservation.save(callback);
}