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
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
    .catch((error) =>
        console.log(
            "Something went wrong when retrieving an access token",
            error
        )
    );

// Our routes go here:
// Root route of express app

app.get("/", (req, res) => {
    res.render("search-artists-form");
});

app.get("/artist-search", (req, res) => {
    const artistName = req.query.artistName
    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            res.render("artist-search-results", data.body.artists.items)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id)
        .then(data => {
            res.render("albums", data.body.items)
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.get("/tracks/:id", (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
        .then(data => {
            res.render("tracks", data.body.items)
        })
        .catch(err => console.log('The error while searching tracks occurred: ', err));
})


app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);