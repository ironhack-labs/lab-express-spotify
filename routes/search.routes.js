const express = require('express')
const router = express.Router()



// Endpoints
router.get('/', (req, res) => {
    
    const artistValue = req.query.artist 
    
    const SpotifyWebApi = require('spotify-web-api-node')


    // Spotify
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });

    spotifyApi
        .clientCredentialsGrant()
        .then(data => console.log(data))
        .catch(error => console.log('Something went wrong when retrieving an access token', error));



    res.send('hola')
})


module.exports = router