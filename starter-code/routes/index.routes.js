const express = require('express')
const router = express.Router()
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
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
    res.render('index')
})
// router.get('/artist-results', (req, res) => {
//     spotifyApi.searchArtists(req.query.artist)
//         .then(artist => {
//             console.log(artist.body.artists.items[0].images[0].url)
//             res.render('artist-results', { algo: artist.body.artists.items })
//         })
//         .catch(err => console.log('Hey mira ', err))

// })

router.get('/artist-results/', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(artist => {
            console.log(artist.body.artists.items[0].images[0].url)
            res.render('artist-results', { algo: artist.body.artists.items })
        })
        .catch(err => console.log('Hey mira ', err))

})

router.get('/albums/:id', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id)
        .then(albums => {
            console.log(albums.body.items)
            res.render('albums', { algo: albums.body.items })
        })
        .catch(err => console.log('Hey mira ', err))
})

router.get('/view-tracks/:id', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
        .then(tracks => {
            console.log(tracks)
            res.render('view-tracks', { algo: tracks.body.items })
        })
        .catch(err => console.log('Hey mira ', err))

})



module.exports = router;