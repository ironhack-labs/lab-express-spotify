const express = require('express')
const router = express.Router()

//spotify
var SpotifyWebApi = require('spotify-web-api-node');
var clientId = '6cfb0c49a6ea4c9ab85f28c89cbfac62',
    clientSecret = 'c76c896435e64db2a94299f943b563c8';

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

//rutas

router.get('/',(req,res)=>{
    const {search}=req.query
    console.log(search)
    if(search){
        spotifyApi.searchArtists(search)
        .then(data => {
            let artist = data.body.artists.items
             res.render('artista',{artist})
         
        })
        .catch(err => {
         console.log(err,"holaaaa")
         })
    }else{
        res.render('home')
    }
    
})

router.get('/artista/:id',(req,res)=>{
    const {id} = req.params
    spotifyApi.getArtistAlbums(id).then(
        
        function(data) {
            
        let album = data.body.items
            
          res.render('albumes',{album})
        },
        function(err) {
          console.error(err);
        }
      );
})
router.get('/canciones/:idd',(req,res)=>{
    const{idd} = req.params
    spotifyApi.getAlbumTracks(idd, { limit : 5, offset : 1 })
  .then(function(data) {
    let canciones = data.body.items;
    res.render('canciones',{canciones})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})





module.exports = router