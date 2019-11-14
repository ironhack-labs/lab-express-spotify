require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser"); //es posible que haya ue bajarlo




const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


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

// the routes go here:
app.get("/", (req, res, next) => {
    res.render("index");

});

app.post('/artists', (req, res) => {
    let name = req.body.artists

    spotifyApi
        .searchArtists(name)
        .then(data => {
            let artistReq = data.body.artists.items



            // console.log("The received data from the API: ", data.body.artists.items);
            res.render("artists", {
                artistReq
            })

        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
})

app.get('/albums/:id', (req, res) => {
    let idAlbum = req.params.id

    spotifyApi
        .getArtistAlbums(idAlbum)

        .then(data => {
            let albumObj = data.body.items;
            res.render("albums", {
                albumObj
            })

        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
})
app.get('/tracks/:id', (req, res) => {
    let idTrack = req.params.id

    spotifyApi
        .getAlbumTracks(idTrack)

        .then(data => {
            let trackObj = data.body.items;
            res.render("tracks", {trackObj})

        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
})





app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));