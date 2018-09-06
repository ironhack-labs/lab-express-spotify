var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '0904ba7af5ea4a3cbae5c130a8fff88c',
    clientSecret = '0ab00dd676ae43a59a4069c8779f5d94';

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