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



// Endpoints
router.get('/', (req, res) => res.render('index'))





router.get('/artist-search', (req, res) => {

    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('Search artists', data.body);
            res.render('artist-search-results', data.body)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})




router.get('/albums/:id', (req, res) => {

    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            console.log('Search albums', data.body)
            res.render('albums', data.body)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
});


router.get('/tracks/:id', (req, res) => {

    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(data => {
            console.log('Search albums', data.body)
            res.render('tracks', data.body)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
});



module.exports = router


