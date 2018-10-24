function getUserListHandlebarsHelper(users, options) {
	var finalString = "<table class='bordered'>\n<thead>\n<th>Email</th>\n<th>Admin?</th>\n<th>Edit</th>\n</thead>";
	for (var user in users) {
		finalString += "<tr>";
		finalString += "<td>" + users[user]["email"] + "</td>";
		finalString += "<td>" + (users[user]["admin"] ? "Yes" : "No") + "</td>";
		finalString += "<td><a class='waves-effect waves-light btn-large red' href='/admin/edituser/" + users[user]["_id"] + "'><i class='material-icons left'>create</i>Edit</a></td>";
		finalString += "</tr>";
	}
	finalString += "</table>";
	return finalString;
}

module.exports = {
	getUserListHandlebarsHelper: getUserListHandlebarsHelper
};