require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
const path = require('path')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'dissertation')))
// use JWT auth to secure the api '/api/users/authenticate', '/api/users/register',
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register',/^\/api\/users\/verifytoken\/.*/,
'/api/users/resetpassword','/api/users/reset','/api/users/serp','/api/users/search','/api/users/initial',
'/api/users/getbook/:id','/api/users/bookinfo',/^\/api\/users\/getbook\/.*/,"/api/users/upload","/api/users/create","/api/users/comment","/api/users/newcomment",
'/api/users/search/:id','/api/users/favbook',/^\/api\/users\/search\/.*/,'/api/users/like','/api/users/removebook'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
var server = app.listen(8000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});
