const express = require('express');

const app = express();

// index route
app.get('/', (request, response, next) => {
  console.log(request);
  response.send('Hello Isak');
});

// start server
app.listen(3000, () => console.log('The server has started'));

/*
const SpotifyWebApi = require('spotify-web-api-node');

const spotify = new SpotifyWebApi();

spotify.searchArtists('The Beatles', {}, (err, data) => {
  if (err) throw err;

  let artists = data.body.artists.items;
  console.log(artists);
});
*/
