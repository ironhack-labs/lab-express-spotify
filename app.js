require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
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
    res.render('home.hbs');
});

app.get('/artist-search', (req, res) => {
  // console.log(req.query);
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    const artist = data.body.artists.items;
    // console.log(artist);
    // console.log('The received data from the API: ', data.body);
    res.render('artist-search-results', { artist });
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {

  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {

    // console.log('Albums of artist: ', data.body);
    // res.json(data)
    res.render('albums', {album: data.body.items});

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/tracks/:albumId', (req, res, next) => {

  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {

    // console.log('Tracks of albums: ', data.body.items);
    res.render('tracks', {tracks: data.body.items});

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
