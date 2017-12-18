var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');

// Database
var mongoose = require('mongoose');
var methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/blog');
var db = mongoose.connection;


// var uristring =
//   process.env.MONGODB_URI ||
//   'mongodb://<cangon86>:<Carlos333>@ds041140.mlab.com:41140/js-app',
//   db,
//   users,
//   posts;

// mongoose.connect(uristring, function (err, res) {
//   if (err) {
//     db = database;
//     users = db.collection("users");
//     posts = db.collection("posts");
//     var server = app.listen(process.env.PORT || 3000);
//     console.log ('ERROR connecting to: ' + uristring + '. ' + err);
//   } else {
//     console.log ('Succeeded connected to: ' + uristring);
//   }
// });

// Routes
var index = require('./routes/index');
var users = require('./routes/users');

// posts and comments
var posts = require('./routes/posts');
var comments = require('./routes/comments');

// Init App
var app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function(req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
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

// Connect Flash
app.use(flash());
// app.use(function(req, res, next) {
//   res.locals.message = req.flash();
//   next();
// });

// Global Vars
app.use(function (req, res, next) {
  res.locals.message = req.flash();
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash();
  res.locals.error = req.flash();
  res.locals.user = req.user || null;
  next();
});



app.use('/', index);
app.use('/users', users);

// posts and comments
app.use('/posts', posts);
app.use('/posts', comments);

app.param(':pid', function(req, res, next) {
    console.log('pid request');
    next();
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
