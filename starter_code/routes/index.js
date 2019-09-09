const router=require('express').Router()

router.get('/',(req,res)=>{
    res.render('index')
})

router.get('/artists',(req,res)=>{
    spotifyApi.searchArtists(req.query.artist)
  .then(data => {
   // console.log("The received data from the API: ", data.body.artists);
    const artistas=data.body.artists
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artists',data.body.artists)
})
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
    
})

const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '5cb3f49e198044449c335eddce8f0940';
const clientSecret = '566135424d8f4849bd0b633a6b3d6003';
const spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
  });
 

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log(data.body['access_token'])
    console.log("entraste")
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

  

//exportar
module.exports=router