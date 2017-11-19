const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

var search = 'bitchin!';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

//Spotify app

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '7b29aeed39f3458892f7906969703495',
    clientSecret = '0fd3db67205049d5974b20b617ecc1c3';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

// App Logic

app.get('/', function(req, res, next) {
  res.render('artists', { title: 'Artists', search: search});
});

app.get('/artists', (req, res) => {
  search = req.query.artist;
  spotifyApi.searchArtists(search)
  .then((data) => {
    console.log(`Search artists by ${search}`);
    data.body.artists.items.forEach((e) => console.log(e.name));
    res.render('artists', { title: 'Artists', search:data.body.artists.items});
  }, (err) => {
    console.error(err);
  });
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
