require('dotenv').config();

//console.log('CLIENT_ID', process.env.CLIENT_ID);
//console.log('CLIENT_SECRET', process.env.CLIENT_SECRET);

const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    console.log(
      '********* clientCredentialsGrant result **********',
      data.body
    );
    let resultofToken = spotifyApi.setAccessToken(data.body.access_token);

    spotifyApi
      .getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', { limit: 10, offset: 20 })
      .then(
        function (data) {
          console.log('Album 0 information', data.body.items[0]);
        },
        function (err) {
          console.error(err);
        }
      );

    return resultofToken;
  })
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

const express = require('express');
const app = express();
const port = 3020;

app.get('/', (req, res) => {
  spotifyApi
    .getAlbum('5U4W9E5WsYb2jUQWePT8Xm')
    .then((data) => res.send(data.body))
    .catch((err) => console.log(err));
});

app.get('/getArtistAlbums', (req, res) => {
  spotifyApi
    .getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
    .then((data) => res.send(data.body))
    .catch((err) => console.log(err));
});

app.get('/searchArtists', (req, res) => {
  spotifyApi
    .searchArtists('Love')
    .then((data) => res.send(data.body))
    .catch((err) => console.log(err));
});

app.get('/getAlbumTracks', (req, res) => {
  spotifyApi
    .getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', { limit: 5, offset: 1 })
    .then((data) => res.send(data.body))
    .catch((err) => console.log(err));
});

app.listen(port, () =>
  console.log('My Spotify project running on port 3020 🎧 🥁 🎸 🔊')
);
