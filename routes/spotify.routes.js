const express = require('express');
const router = express.Router();
const axios = require("axios");
const SpotifyWebApi = require('spotify-web-api-node');


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

router.get('/', (req, res) => {
    res.render('landing.hbs');
});

router.post('/artist-search', (req, res) => {

    const {search} = req.body;
    spotifyApi.searchArtists(search)
    .then((response) => {
        let artists = response.body.artists.items;
        res.render('artist-search-results.hbs', {artists});
    })
    .catch(() => {
        console.log('something went wrong');
    });
});

router.get('/albums/:id', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then((response) => {
        let albums = response.body.items;
        res.render('artist-albums.hbs', {albums});
    })
    .catch(() => {
        console.log('something went wrong');
    });
});

router.get('/album-tracks/:id', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then((response) => {
        let tracks = response.body.items;
        res.render('album-tracks.hbs', {tracks});
    })
    .catch(() => {
        console.log('something went wrong getting tracks');
    });
});

module.exports = router;