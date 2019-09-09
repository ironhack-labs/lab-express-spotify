// setup dotenv package
require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log(
            "Something went wrong when retrieving an access token",
            error
        );
    });
// the routes go here:
app.get("/", (req, res) => {
    res.render("index");
});
/*######################################## - GET ARTISTS - ########################################*/
app.get("/artists", (req, res) => {
    spotifyApi
        .searchArtists(req.query.q)
        .then(data => {
            res.render("artists", data);
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});
/*######################################## - GET ALBUMS - ########################################*/
app.get("/albums/:artistId", (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            res.render("albums", data);
        })
        .catch(err => {
            console.log("An error occurred: ", err);
        });
});
/*######################################## - GET TRACKS - ########################################*/
app.get("/tracks/:albumId", (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            res.render("tracks", data);
        })
        .catch(err => {
            console.log("An error occurred: ", err);
        });
});

app.listen(3002, () =>
    console.log("My Spotify project running on port 3002 🎧 🥁 🎸 🔊")
);
