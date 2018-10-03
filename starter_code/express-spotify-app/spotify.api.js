const
  SpotifyWebApi = require('spotify-web-api-node'),

// Remember to paste here your credentials
  clientId = '20f6b0629af44a77b5fce0cb6e37260d',
  clientSecret = 'e9f92ac493ba4ee8ab23740b84595074',

  spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
  });

// Retrieve an access token.
const credentials = spotifyApi
  .clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  })
;

credentials;

module.exports = spotifyApi;