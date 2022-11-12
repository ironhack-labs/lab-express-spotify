const express = require('express')
const router = express.Router()
const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


router.get('/', (req, res) => {
    res.render('index');
})

router.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const artists = data.body.artists.items
            res.render('artist-search-results', { artists });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

router.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            const albums = data.body.items
            res.render('albums', { albums })
        })
});

router.get('/tracks/:albumsId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumsId)
        .then(data => {
            const tracks = data.body.items
            res.render('tracks', { tracks })
        })
})

module.exports = router