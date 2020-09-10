const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.render('index'))


var SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));


router.get('/artist-search', (req, res) => {
    console.log(req.query)
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            res.render('artist-results', {searchedArt: data.body.artists.items} )
        })
        .catch(err => console.log('error', err));

})

router.get('/:artistId/albums', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        res.render('albums-results', {artistAlbums: data.body.items})
    })
    .catch(err => console.log('Error', err))
});



router.get('/:albumId/tracks', (req,res)=>{

    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data =>{

        res.render('tracks-results', {tracksPage: data.body.items})
    })
    .catch(err => console.log('Error', err))
})
module.exports = router


