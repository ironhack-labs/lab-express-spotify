const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');
//require('dotenv').config();

const app = express();

// require spotify-web-api-node package here:

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// setting the spotify-api goes here:

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('home');
  });

  app.get('/artist-search', (req, res) => {
    spotifyApi
      .searchArtists(req.query.artistsName)
      .then(data => {
       // console.log('Artist from the database:')
        res.render('artist-search-results', {artists: artists})
      })
      .catch(error => console.log(error));
  });

  app.get('/albums/:artistId', (req, res) => {
    spotifyApi
  .getArtistAlbums(req.params.artistsId) 
  .then(data => {
    //console.log('Albums information', data.body);
    res.render('albums', {albums: albums})
})
.catch(error => console.log(error));
});

app.get('/albums/:tracks', (req, res) => {
    spotifyApi
  .getAlbumsTracks(req.params.tracks) 
  .then(data => {
    //console.log('tracks information', data.body);
    res.render('tracks', {tracks: tracks})
})
.catch(error => console.log(error));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
