var express = require('express');
var router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi({
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



/* GET home page. */

router.get('/:id', function (req, res, next) {

    spotifyApi.getArtistAlbums(req.params.id).then(

        function (data) {

            let items = data.body.items;
            let package = []
            for (let index = 0; index < items.length; index++) {

                if (items[index].images.length > 0) {
                    let obj = {
                        id: items[index].id,
                        name: items[index].name,
                        image: items[index].images[1].url
                    }
                    package.push(obj);
                }
            }
            // "name": "The Beatles",
            req.app.locals.name = items[0].artists[0].name
            // res.send(items[0].artists[0].name)

            // res.send(package);
            res.render("albums", {
                package
            });
        },
        function (err) {
            console.error(err);
        }
    );
    // res.render("albums", data);
});


module.exports = router;