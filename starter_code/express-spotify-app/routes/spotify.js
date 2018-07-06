const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
// Setters
var clientId = 'b2ca520ca1d24999b30a36327203d1ca',
    clientSecret = '13853f1c7dbb4a90a22f360aace56c5b';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Error ', err);
});

router.get('/', (req, res) => {
  res.render('home.hbs');
});

router.post('/', (req,res)=>{
  const {search} = req.body;
  const query = {};
  if(search) query.name = {$regex:search, $options:'i'}
  spotifyApi.find(query)
  .then(items => res.render('artists.hbs', {items}))
  .catch(e=>res.send(e));
  //1. hace la busqueda en la bd (model)
  //2. dentro de la .then, renderiza el view pero le pasa los resultados
})

module.exports = router; 