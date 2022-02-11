require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId: 'c3bca81ef3a1452ca853554cfe0ca916',
  clientSecret: '65770b6acb9a47ae94d37a75d461129c',
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
  res.render('index', {
    docTitle: 'Homepage',
  });
});

app.get('/artist-search', (req, res) => {
  const artistQuery = req.query.artist;
  spotifyApi
    .searchArtists(artistQuery)
    .then((response) => {
      const artists = response.body.artists.items;
      // res.send(artists);
      res.render('artist-search-results', { artists });
    })
    .catch((err) => console.error(err));
});

app.listen(3000, () =>
  console.log('My Spotify project running at http://localhost:3000 🎧 🥁 🎸 🔊')
);
