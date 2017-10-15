require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

//try redis store but redis not support windows
// var redisStore = require('connect-redis')(session);
// var sess = { 
//     secret: config.secret,
//     store: new redisStore({
//         url:'redis://localhost'       
//     }), 
//     resave: false, 
//     saveUninitialized: true 
//     // cookie:{
//     //     maxAge:60000,
//     // }
// };
// app.use(session(sess));

//try memcached
// cookieParser = require("cookie-parser");
// MemcachedStore = require("connect-memcached")(session);
// app.use(cookieParser());
// app.use(session(
//     {
//         secret:config.secret,
//         key:'test',
//         proxy:'true',
//         store:new MemcachedStore(
//             {
//                 hosts:['127.0.0.1:11211'],
//                 secret:config.secret
//             }
//         )
//     }
// ));
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
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});
