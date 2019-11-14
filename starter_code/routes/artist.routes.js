const express = require('express');
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });

/* GET home page */
router.get("/", (req, res) => res.render("artist"))

router.post('/', (req, res, next) => {
    console.log(req.body)

    spotifyApi.searchArtists(req.body.artist)
        .then(data => {
            console.log(data.body.artists.items, "caramelo")
            // console.log("The received data from the API: ", data.body.artist);
            res.render('artist', {
                artist: data.body.artists.items
            })

            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
})

////////


router.get("/albums/:id", (req, res) => {
        spotifyApi.getArtistAlbums(req.params.id)
            .then(data => {
                console.log(data.body.items, 'luis')
                res.render('albums', {data})})
            .catch(err => {
                console.log("The error while searching artists occurred: ", err);
            });
    })

////////


router.get("/viewTracks/:id", (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
        .then(data => {
            res.render('viewTracks', {
                data
            })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
})

module.exports = router;