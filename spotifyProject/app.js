require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const spotifyWebApi = require('spotify-web-api-node');
const axios = require('axios')

mongoose
  .connect('mongodb://localhost/spotifyproject', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

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

hbs.registerPartials(__dirname + "views/partials")

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Remember to paste your credentials here //This should be retrieved from the session of the client 
var clientId = '93d59ad2107e4d9c8c055c4b4880b336',
    clientSecret = '22bb811837cf47b39e25c6e5f84f335c';

var spotifyApi = new spotifyWebApi({
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


const index = require('./routes/index');
var searched = require("./routes/searched")
const albums = require('./routes/albums')
const tracks = require('./routes/tracks')

app.use('/', index);
// app.use('/searched', searched)
app.use("/albums", albums)
app.use('/tracks', tracks)

app.listen(4000, () => {
  console.log("Access to port 3000 in your personal server")
})
