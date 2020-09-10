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

router.get('/artist-search', (req, res) => {

    // console.log('Holaaaaa')

    spotifyApi
        .searchArtists(`${req.query.artist}`)
        .then(data => {
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

            const items = data.body.artists.items

            res.render('artist-search-results.hbs', { items })

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

router.get('/albums/:artistId', (req, res, next) => {

    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then((data => {

            const albums = data.body.items

            res.render('albums.hbs', { albums })

        }))

})

router.get('/tracks/:albumId', (req, res, next) => {

    spotifyApi
        .getAlbumTracks(req.params.albumId, { limit: 50, offset: 1 })
        .then((data => {

            const tracks = data.body.items

            res.render('tracks.hbs', { tracks })

        }))

})



module.exports = router