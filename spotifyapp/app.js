var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const artistsRouter = require('./routes/artists');
const albumRouter = require('./routes/albums');
const trackRouter = require('./routes/tracks');


var app = express();
const hbs = require('hbs');

const mongoose = require('mongoose');
require("dotenv").config();
const SpotifyWebApi = require('spotify-web-api-node');

// const spotifyApi = new SpotifyWebApi({
//   clientId : process.env.CLIENT_ID,
//   clientSecret : process.env.CLIENT_SECRET
// });

// // Retrieve an access token.
// spotifyApi.clientCredentialsGrant()
//   .then(function(data) {
//     spotifyApi.setAccessToken(data.body['access_token']);
//     console.log("access-success-log!!",data)
//   }, function(err) {
//     console.log('Something went wrong when retrieving an access token', err);
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/artists', artistsRouter);
app.use('/albums', albumRouter);
app.use('/tracks', trackRouter);

//here connect with database
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology:true
})
.then(() => {
  console.log('Connected to Mongo!');
})
.catch(err => {
  console.error('Error connecting to mongo', err);
});


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

module.exports = app;
