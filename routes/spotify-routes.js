const express = require('express');
const router = express.Router();
const spotifyApi = require('../config/spotify')

router.get('/', (req, res, next) => {
    res.render('home');
});

router.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const artist = { artist: data.body.artists.items }
            res.render('artist-search-results', artist)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

router.get('/albums/:artistId', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            const album = { album: data.body.items }
            res.render('albums', album)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

router.get('/tracks/:trackId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then(data => {
            const tracks = { tracks: data.body.items }
            res.render('tracks', tracks)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

module.exports = router;

