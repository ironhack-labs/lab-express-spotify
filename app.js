require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((apiRes) => res.render('artist-search-results', { apiRes }));
});
app.get('/albums/:id', (req, res) => {
  let artistId = req.params.id;
  spotifyApi.getArtistAlbums(artistId).then((apiRes) => {
    res.render('albums', { apiRes: apiRes.body.items });
  });
});
app.get('/tracks/:id', (req, res) => {
  let recordId = req.params.id;
  spotifyApi.getAlbumTracks(recordId).then((apiRes) => {
   res.render('tracks',{apiRes:apiRes.body.items})();
  });
});
app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
