const app = express();

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'a1f2ae8f6e744ee3bfe1e5db4593633f',
    clientSecret = '1296021a5b2f4b1d8a5a5d8b775363de';

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


app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
