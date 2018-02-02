var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('scout');
});

router.get('/register', function(req, res) {
	res.render('register');
});

router.post('/register', function(req, res) {
	var email = req.body.email;
	req.checkBody('email', 'Please enter a valid email!').isEmail();

	var errors = req.validationErrors();
	console.log(getPath(req.originalUrl));
	if (errors) {
		res.render('register', {
			errors: errors,
			path: getPath(req.originalUrl)
		});
	} else {
		console.log("NO");
	}
});

router.get('/list', function(req, res) {
	res.render('list');
});

module.exports = router;