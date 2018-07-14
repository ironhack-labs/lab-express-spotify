const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParse = require('body-parser');
const SpotifyWebAPI = require('spotify-web-api-node');

const app = express();

const spotifyAPI = new SpotifyWebAPI();

app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  res.render('artists');
});

app.get('/albums', (req, res, next) => {
  res.render('albums');
});

app.get('/tracks', (req, res, next) => {
  res.render('tracks');
});

app.listen(3000);
