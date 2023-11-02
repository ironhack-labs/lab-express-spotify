const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

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

router.get("/", (req, res) => {
    res.render("home-page")
})

router.get('/artist-search', (req, res) => {
    console.log(req.query)
    const { artistName } = req.query
    spotifyApi
        .searchArtists(artistName)
        .then(artistName => {
            // console.log('The received data from the API: ', artistName.body.artists);

            res.render('artist-search-results', { artists: artistName.body.artists.items })
        })


        .catch(err => console.log('The error while searching artists occurred: ', err));
})


router.get('/albums/:artists_id', (req, res) => {

    const { artists_id } = req.params
    spotifyApi
        .getArtistAlbums(artists_id)
        .then(data => {
            // console.log('Album information', data.body)
            res.render('artist-albums', { albums: data.body.items })

        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
})
router.get('/songs/:albums_id', (req, res) => {
    const { albums_id } = req.params
    spotifyApi
        .getAlbumTracks(albums_id)
        .then(data => {
            console.log('Album information', data.body)
            res.render('album-songs', { songs: data.body.items })
        })
        .catch(err => console.log('The error while searching songs occurred: ', err));
})

// router.get('artist-search/albums', (req, res) => {
// const { artistName } = req.query
// spotifyApi
//     .searchArtists(artistName)
//     .then(artistName =>)
// })

module.exports = router