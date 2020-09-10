const express = require('express')
const router = express.Router()
const SpotifyWebApi = require('spotify-web-api-node')

// Spotify
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Endpoints
router.get('/:id_album', (req, res) => {

    const id = req.params.id_album

    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('albums', data.body)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})


module.exports = router