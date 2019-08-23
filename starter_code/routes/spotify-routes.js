const express = require('express');
const {
  index,
  artists,
  albums,
  tracks,
} = require('../controler/spotify-controler');

const routes = express();

routes.get('/', index);
routes.post('/artists', artists);
routes.get('/albums', albums);
routes.get('/tracks', tracks);


module.exports = routes;
