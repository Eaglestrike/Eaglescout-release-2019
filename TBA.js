const https = require("https");
const config = require("./config");
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
			var events = JSON.parse(body);
			callback(events, null);
		});
	});
}