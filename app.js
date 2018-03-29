var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/eaglescout');
var db = mongoose.connection;
var login = require('./routes/login');
var scout = require('./routes/scout');
var admin = require('./routes/admin');
var utils = require('./utils');
var observationForm = require('./observationForm');

var User = require('./models/user');
User.createAdminUserIfNotExists();

var app = express();
var hbs = exphbs.create({
    defaultLayout: 'layout',
    helpers: {
        observationForm: observationForm.getObservationFormHandlebarsHelper,
        table: observationForm.getTableHandlebarsHelper,
        ranking: observationForm.getRankingHandlebarsHelper
    }
});

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.currentlyCurrentEvent = utils.getCurrentEvent() != null;
    next();
});

app.use('/', login);
app.use('/scout', scout);
app.use('/scout/list', scout);
app.use('/scout/teamranking', scout);
app.use('/scout/new', scout);
app.use('/admin', admin);
app.use('/admin/register', admin);
app.use('/admin/event', admin);

app.set('port', (3000));

app.listen(app.get('port'), function(){
    console.log('Eaglescout started on port ' + app.get('port'));
});