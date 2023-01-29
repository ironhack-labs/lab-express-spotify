//todo lo relacionado con la config de spotify
//el codigo paraconfigurar libreria spotify con tu id
//con esos dos bloques, libreria util
const SpotifyWebApi = require('spotify-web-api-node');
// Requerir libreria spotify-web-api-node package

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

// autenticado
    spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => 
        console.log('Something went wrong when retrieving an access token', error)
    );

module.exports = spotifyApi
