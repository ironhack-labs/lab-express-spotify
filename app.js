require('dotenv').config();
// require('./config/dbConnect');

const express = require('express');
const hbs = require('hbs');
const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
// app.use(logger('dev'));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

const indexRouter = require('./routes/index');
const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/albums');
const trackRouter = require('./routes/tracks');

app.use(indexRouter);
app.use(artistRouter);
app.use(albumRouter);
app.use(trackRouter);

// Our routes go here:

app.listen(3000, () =>
  console.log('My Spotify project running on http://localhost:3000 🎧 🥁 🎸 🔊')
);

module.exports = app;
