const express = require('express')
const router = express.Router()
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Endpoints

router.get('/', (req, res) => res.render('index'))

router.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists("beatles")
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('artist-search', data.body)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

module.exports = router