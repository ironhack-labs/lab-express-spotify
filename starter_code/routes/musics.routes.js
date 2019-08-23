const express = require('express');
const app = express();
const { artistsRoute, albumsRoute, tracksRoute, index } = require('../controllers/musicsRoutes.controller')

app.get('/', index);

app.post('/artists', artistsRoute);

app.get('/albums/:artistId', albumsRoute);

app.get('/tracks/:albumId', tracksRoute);

module.exports = app;