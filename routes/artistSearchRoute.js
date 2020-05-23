const express = require('express')
const router = express.Router()
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

router.get("/", (req, res, next) => {
    spotifyApi.searchArtists(req.query.artista)
        .then(function (data) {
            console.log('Artist albums', data.body);
            res.render('artist-search-results', {artista: data.body.artists.items})
        }, function (err) {
            console.error(err);
        });
})

module.exports = router;


//console.log([imagen] = data.body.artists.items[0].images)