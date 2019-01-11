require('dotenv').load();

const express      = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const app          = express(); 


mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'f851ef033623414bbb0e1f7e77e53c59',
    clientSecret = 'f7b99f68bdb54a38ad0fcea5350fadc0';

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

app.post("/artist", function(req, res, next){
  spotifyApi.searchArtists(req.body.term.split(" ")[0])
  .then((response) => {
  let artist = req.body.term;
  let artistInfo=response.body.artists.items
  if (artistInfo.length>0){
  res.render("artist", {artistInfo: artistInfo, artist: artist})
  } else{
  res.render("index")
  }
  }).catch((err) => {
  res.render("index")
  });
  });


const index = require('./routes/index');
app.use('/', index);

app.listen(3000);
module.exports = app;
