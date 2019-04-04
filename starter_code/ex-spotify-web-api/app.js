const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const SpotifyWebApi = require('spotify-web-api-node');
const hbs = require('hbs');

const clientId = '664e2efd43804662a540e5fe84f0b39e'
const clientSecret = 'a106fd701b07452da5b73bd6937afb44'

const spotifyApi = new SpotifyWebApi ({
  clientId,
  clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


const indexRouter = require('./routes/index.routes');
const artistRouter = require('./routes/artist.routes');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/artist', artistRouter);

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



// const CLIENT_ID = '664e2efd43804662a540e5fe84f0b39e'
// const CLIENT_TOKEN = 'a106fd701b07452da5b73bd6937afb44'


// const express = require('express');
// const hbs = require('hbs');

// // require spotify-web-api-node package here:



// const app = express();

// app.set('view engine', 'hbs');
// app.set('views', __dirname + '/views');
// app.use(express.static(__dirname + '/public'));


// // setting the spotify-api goes here:






// // the routes go here:



// app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
