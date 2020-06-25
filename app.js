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

app.get('/', (req, res) => {
    res.redirect('/home')
    });

app.get('/home', (req, res) => {
    res.render('home')
    }); 

app.get('/artist-search', (req, res) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      const artist = {artist: data.body.artists.items}
      res.render('artist-search-results', artist)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      const album = {album: data.body.items}
      res.render('albums', album)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:trackId', (req, res) => {
    spotifyApi
    .getAlbumTracks(req.params.trackId)
    .then(data => {
    const tracks = {tracks: data.body.items}
    res.render('tracks', tracks)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
