var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'cb898361ea19473a8b041f0c17122ff1',
    clientSecret = '7727fdd2681c4fc6b24e8720b6957eac';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Express' });
});

router.post('/', (req,res,next)=>{

  console.log('##################',req.body.searchArtist)
if(req.body.searchArtist){
    spotifyApi.searchArtists(req.body.searchArtist)
    .then((data)=> {
      // debugger
      console.log(data.body.artists.items)
      res.render('artists', { title: 'Express', info: data.body.artists.items });
    })
    .catch((err)=> {

      console.log(err)
      res.send("ERROR");

    })
}else{
  res.redirect('/')
}
 

})

spotifyApi.clientCredentialsGrant()
.then((data)=> {
  spotifyApi.setAccessToken(data.body['access_token'])

  return spotifyApi
}).catch((err)=> {

  console.log(err)
  res.send("ERROR");

})

module.exports = router;
