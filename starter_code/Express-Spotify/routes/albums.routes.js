const express = require('express');
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });


router.get("/:id", (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(data => {
            console.log(data.body.items)
            res.render("albums", {data})


                .catch(err => {
                    console.log("The error while searching artists occurred: ", err);
                })
        })
})

module.exports = router;