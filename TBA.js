const https = require("https");
const config = require("./config");
const utils = require("./utils");
const keys = require("./keys");

module.exports.getEvents = function(callback) {
	const url = config.TBA_URL + "/events/2018/simple?X-TBA-Auth-Key=" + keys.TBA_API_KEY;
	https.get(url, res => {
		var body = "";
		res.setEncoding("utf8");
		res.on("error", error => {
			callback(null, error);
		})
		res.on("data", data => {
			body += data;
		});
		res.on("end", () => {
			var data = JSON.parse(body);
			var events = data.map(function (event) {
				return {
					"key": event.key,
					"name": event.name,
					"current": event.key == utils.getCurrentEvent()
				}
			});
			events.splice(0, 0, {
				"key": "practice",
				"name": "Practice Competition",
				"current": utils.getCurrentEvent() == "practice"
			});
			callback(events, null);
		});
	});
}