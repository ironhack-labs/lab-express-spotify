require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
    .catch((error) =>
        console.log("Something went wrong when retrieving an access token", error)
    );

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
// Our routes go here:
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/artist-search", (req, res) => {
    spotifyApi
        .searchArtists(req.query.name)
        .then((data) => {
            console.log("The received data from the API: ", data.body.artists.items);
            const artistArray = data.body.artists.items;
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search", { data: artistArray });
        })
        .catch((err) =>
            console.log("The error while searching artists occurred: ", err)
        );
});
app.get("/albums/:name", (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.name)
        .then((data) => {
            console.log("albums", data.body);
            res.render("albums", { data: artistArray });
        })

    .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);