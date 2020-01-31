const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

spotifyApi
.clientCredentialsGrant()
.then(data=> spotifyApi.setAccessToken(data.body['access_token']))
.catch(err =>console.log('Sometimes went wrong when retriving an access token', err))

module.exports = spotifyApi