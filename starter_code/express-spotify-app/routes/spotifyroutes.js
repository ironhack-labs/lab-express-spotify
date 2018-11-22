var SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const router = express.Router()

var clientId = '5a4842ba39bd45a5b95f9b12f7be1a54',
    clientSecret = '92cef8bf488d4f6d995ab69f7e4f3c7b';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

router.get('/', (req,res) => {
    const {search} = req.query
    if(search){
        spotifyApi.searchArtists(search)
        .then( data => {
        let artists = data.body.artists.items
        res.render('artists',{artists})
        })
        .catch( error => {
            console.log(error)
        })
        
    } else{
        res.render('home')
    }
})

router.get('/albums/:id', (req,res) => {
    const {id} = req.params
    spotifyApi.getArtistAlbums(id)
    .then( data => {
        let albums = data.body.items
        res.render('albums',{albums})
    })
    .catch( e => {
        res.send(e)
    })
})

router.get('/tracks/:id', (req,res) => {
    const {id} = req.params
    spotifyApi.getAlbumTracks(id)
    .then( data => {
        let tracks = data.body.items
        res.render('tracks',{tracks})
    })
    .catch( e => {
        res.send(e)
    })
})
module.exports = router