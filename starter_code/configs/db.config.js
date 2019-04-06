
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '8897073bbcb646e3991e7c81910d6353',
	clientSecret = '1ff5764a4b5e4dbeb1c0e31bafe7f75f';

const spotifyApi = new SpotifyWebApi({
	clientId: clientId,
	clientSecret: clientSecret,
});

spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']); // hay que meterlo debajo de aqui pk
    // es una promesa y está esperando comprobar las credenciales, luego en la ruta tiene que ir bien
    console.log(`conected`)
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

  module.exports = spotifyApi;