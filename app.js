require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
  });

app.get('/artist-search', (req, res) => {
    const artistName = req.query.artistName;
    spotifyApi
  .searchArtists(artistName)
  .then(data => {
    // console.log('The received data from the API: ', data.body);
    res.render('artist-search-results', {data: data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
});

app.get('/albums/:id', (req, res) => {
    spotifyApi
  .getArtistAlbums(req.params.id, { limit: 10, offset: 20 })
  .then(albumAPI => {
    res.render('albums', {albumAPI: albumAPI.body.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
});

app.get('/preview/:id', (req, res) => {
    spotifyApi
  .getAlbumTracks(req.params.id, { limit : 5, offset : 1 })
  .then(trackAPI => {
    res.render('track', {trackAPI: trackAPI.body.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
