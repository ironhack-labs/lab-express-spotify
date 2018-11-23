var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const router = express.Router()


// Remember to paste your credentials here
var clientId = '3197ad10c1284cd1bcf921cf280c12ee',
    clientSecret = 'febf08b7702d400f86df39a54b5dbd41';

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

router.get('/', (req,res)=>{
    const {search} = req.query
    if(search) {
        spotifyApi.searchArtists(search)
        .then(data =>{
            let artist = data.body.artists.items
            res.render('artists', {artist})

        })
        .catch(error=>{
            console.log(error)
        })
    }else {
        res.render('home')
    }
})

router.get('/albums/:artistId', (req, res) => {
    const {artistId} = req.params
    spotifyApi.getArtistAlbums(artistId)
    .then(function(data) {
            let album= data.body.items
            res.render('album',{album})
        },
        function(err) {
          console.error(err);
        }
      )
    
})

router.get('/canciones/:albumId', (req, res) => {
    const {albumId} = req.params
    spotifyApi.getAlbumTracks(albumId, { limit : 5, offset : 1 })
    .then(function(data) {
        let songs = data.body.items
        res.render('songs', {songs})
    }, 
    function(err) {
        console.log('Something went wrong!', err);
  });
    
})




module.exports = router