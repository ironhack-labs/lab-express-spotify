const SpotifyWebApi   = require('/../spotify-web-api-node');

const spotify = new SpotifyWebApi({
    clientId : 'd9173cf7be274a2280d8171adf8aa2d7',
    clientSecret : '39cc2a98052c4b4781bfe2b06528f7be',
  });

spotify.clientCredentialsGrant()
.then(function(data) {
  console.log('The access token is ' + data.body['access_token']);

  spotify.setAccessToken(data.body['access_token']); 
	}, function(err) {
  console.log('Something went wrong!', err.message);
});

module.exports = spotify;