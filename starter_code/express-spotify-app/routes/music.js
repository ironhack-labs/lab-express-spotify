const express = require('express')
const router = express.Router()

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '501c7e7ddd7241b38d7bd6415caa9416',
    clientSecret = '767d389b8e7b4470984cf00ee5178c99';

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


router.get('/',(req,res)=>{
    res.render('index');
})

router.get('/artist',(req,res)=>{
    const {artist} = req.query
    console.log(artist)
    spotifyApi.searchArtists(artist)
        .then(data => {
            console.log(data.body.artists.items[0].images[0])
            let artist = data.body.artists.items
            res.render('search',{artist})
        })
        .catch(err => console.log(err))

})

router.get('/searchAlbum/:id',(req,res)=>{
    const {id} = req.params
    console.log(id)
    spotifyApi.getArtistAlbums(id).then(
        function(data) {
            let albums = data.body.items

            res.render('albumDetail',{albums})
        },
        function(err) {
            console.error(err);
        })
})

router.get('/getTracks/:id',(req,res)=>{
    const {id} = req.params

    spotifyApi.getAlbumTracks(id, { limit : 5, offset : 1 })
        .then(function(data) {
            console.log(data.body);
            let tracks = data.body.items
            res.render('tracks',{tracks})
        }, function(err) {
            console.log('Something went wrong!', err);
        });
})

module.exports = router