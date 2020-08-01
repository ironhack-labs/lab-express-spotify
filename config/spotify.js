const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token'])
        spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
            function (data) {
                // console.log('Artist albums', data.body);
            },
            function (err) {
                console.error(err);
            }
        );
    })
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

module.exports = spotifyApi;