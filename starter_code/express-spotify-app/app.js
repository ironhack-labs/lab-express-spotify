const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
const clientId = 'da9aa0e9ff6e4218b4da71958c55161f',
    clientSecret = '32d76dd61b624e938152360c256e7095';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });