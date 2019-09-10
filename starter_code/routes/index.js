const router=require('express').Router()
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '5cb3f49e198044449c335eddce8f0940';
const clientSecret = '566135424d8f4849bd0b633a6b3d6003';
//const bodyParser = require('body-parser');
//require('dotenv').config();


const spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
  });
 

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
.then( data => {
  console.log('Entre')
  spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
  console.log('Something went wrong when retrieving an access token', error);
})


router.get('/',(req,res)=>{
    res.render('index')
})

//buscar los artistas
router.get('/artists',(req,res)=>{
    spotifyApi.searchArtists(req.query.artist)
  .then(data => {
   // console.log("The received data from the API: ", data.body.artists);
    const artistas=data.body.artists
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    console.log(data.body.artists)
    res.render('artists',data.body.artists)
})
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
    
})

//aquì obtengo los albunes
router.get('/albumes/:id', (req,res) => {
  const id = req.params.id 
  spotifyApi.getArtistAlbums(id)
  .then(data => {
      res.render('albums', data.body);
  }, function(err) {
      console.error(err);
  });
})

//aquì obtengo los tracks
router.get('/tracks/:id',(req,res)=>{
  const id = req.params.id
  spotifyApi.getAlbumTracks(id)
  .then(data =>{
      res.render('tracks',data.body)
  })
  .catch(err=>{
      console.error(err)
  })
})


//exportar
module.exports=router