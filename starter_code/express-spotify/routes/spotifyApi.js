var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'cb898361ea19473a8b041f0c17122ff1',
    clientSecret = '7727fdd2681c4fc6b24e8720b6957eac';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
.then((data)=> {
  spotifyApi.setAccessToken(data.body['access_token'])

  return spotifyApi
}).catch((err)=> {

  console.log(err)
  res.send("ERROR");

})

module.exports = spotifyApi