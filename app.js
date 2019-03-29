var createError = require('http-errors');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var session  = require('express-session');
var session = require('cookie-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(session({ secret: 'Catererlogs', catererhome: []}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser());
app.use(cookieParser());
//session
// app.use(session({
//   secret: 'Catererlogs',
//   resave:true,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }));
app.use(session({
  name: 'Catererlogs',
  keys: ['caterer', 'logs']
}))

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
//session
app.use(function(req, res, next){
  res.locals.Caterers = req.session.Caterer;
  next(); 
})
module.exports = app;
