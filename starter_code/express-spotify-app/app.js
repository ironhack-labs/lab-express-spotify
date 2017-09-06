const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();

// Remember to paste here your credentials
var clientId = '8f1e69c9802e435e997e1983ec9348d0',
    clientSecret = '4037307a11fd4f2ebc93931ea9b99e25';

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

spotify.searchArtists("The Beatles", {}, (err, data) => {
  if (err) throw err;

  let artists = data.body.artists.items;
  console.log(artists)
});
