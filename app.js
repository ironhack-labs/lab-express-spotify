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

app
    .get('/', (req, res) => {
      res.render('index')
  })

app
    .get('/artist-search', (req, res) => {
        const searchedArtist = req.query.artist
        spotifyApi
            .searchArtists(searchedArtist)
            .then(data => data.body)
            .then((result) => res.render('artist-search-results', {result}))
            .catch(err => console.log('The error while searching artists occurred: ', err));
  })

app
    .get('/albums/:artistId', (req, res, next) => {
        const searchedAlbums = req.params.artistId
        console.log(searchedAlbums);
        spotifyApi
            .getArtistAlbums(searchedAlbums)
            .then(data => data.body)
            .then((albumResult) => {
                console.log(albumResult);
                res.render('albums', {albumResult})
            })
            .catch(err => console.log('The error while searching artists occurred: ', err));
})

app
    .get('/tracks/:albumId', (req, res, next) => {
        const searchedTracks = req.params.albumId
        console.log(searchedTracks);
        spotifyApi
            .getAlbumTracks(searchedTracks)
            .then(data => data.body)
            .then((tracksResult) => {
                console.log(tracksResult);
                res.render('tracks', {tracksResult})
            })
            .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
