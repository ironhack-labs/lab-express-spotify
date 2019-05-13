const express = require('express');
const app = express();
const config = require('../config.json');

// setting the spotify-api goes here:

let SpotifyWebApi = require('spotify-web-api-node');



let spotifyApi = new SpotifyWebApi({
  clientId : config.clientId,
  clientSecret : config.clientSecret,
//   redirectUri: "localhost:3000/oauth"
});

// let scopes = ['user-read-private', 'user-read-email'];
// let state = 'some-state';

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {
    res.render('search');
});

app.get('/artists', (req, res) => {
    
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        
        res.render('artists', {artists: data.body.artists.items})
        
    })
    .catch(err => {
        res.status(500).send('Error occured');
    });
});

app.get('/albums/:artistId', (req, res) => {
    let id = req.params.artistId;
    spotifyApi.getArtistAlbums(id)
    .then((data) => {
        res.render('albums', {albums: data.body.items});
    })
    .catch(err => {
        res.status(500).send('Error occured');
    });
});

app.get('/tracks/:albumId', (req, res) => {
    let id = req.params.albumId;
    spotifyApi.getAlbumTracks(id)
    .then(data => {
        res.render('tracklist', {tracks: data.body.items});
        debugger
    })
    .catch(err => {
        res.status(500).send('Error occured');
    });
});

module.exports = app