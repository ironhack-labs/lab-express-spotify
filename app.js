require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

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

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:

app.listen(3001, () =>
    console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊")
);

app.get("/", (req, res) => {
    // res.send('hola soy artist-search')
    res.render("form-artist");
});

app.get("/artist-search", (req, res) => {
    spotifyApi
        .searchArtists()
        .then((data) => {
            console.log("The received data from the API: ", data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch((err) =>
            console.log("The error while searching artists occurred: ", err)
        );
});

spotifyApi
    .searchArtists()
    .then((data) => {
        console.log("The received data from the API: ", data.body);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
    );