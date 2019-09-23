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


    spotifyApi.getAlbumTracks(req.params.id)
        .then(function (data) {
            let items = data.body.items;
            let package = [];
            for (let index = 0; index < items.length; index++) {

                let obj = {};
                if (items[index].preview_url === null) {
                    obj = {
                        id: items[index].id,
                        name: items[index].name,
                        preview: ""
                    }
                } else {
                    obj = {
                        id: items[index].id,
                        name: items[index].name,
                        preview: items[index].preview_url
                    }
                }

                package.push(obj);


            }

            req.app.locals.name = items[0].artists[0].name
            // res.send(items[0].artists[0].name)



            res.render("tracks", {
                package
            });

        }).catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });


    // res.render('artists');

});

module.exports = router;