const router = require("express").Router()
const SpotifyWebApi = require('spotify-web-api-node')
const { listen } = require("../app")

//spotify config
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))



//rutas



router.get("/", (req, res) => {
    res.render("index");
})

router.get("/artist-search", (req, res) => {

    spotifyApi
        .searchArtists("aerosmith")
        .then(data => {
            console.log('The received data from the API: ', data.body);
           
            res.render('artist-search-result', data)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));


})

module.exports = router