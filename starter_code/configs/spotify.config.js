var SpotifyWebApi = require('spotify-web-api-node');

var clientId = '763db0ca4e0040b0bac99a9786b87c4c';
var clientSecret = 'c7acc899f7364f129b04cf4160f3b938';

var spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
.then(function(data) {
    console.log('OK');
    
    spotifyApi.setAccessToken(data.body['access_token']);
}, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

module.exports = spotifyApi;