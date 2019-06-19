const SpotifyWebApi = require('spotify-web-api-node');

 const clientId = 'd51b81868d4e4de697bbfc4a49692dca';
const clientSecret = 'cab69a6e5383461c92df26c07f82eba2';

 const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

 spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

 module.exports = spotifyApi;