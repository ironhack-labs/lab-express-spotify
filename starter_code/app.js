require("dotenv").config();

const express = require("express")
const hbs = require("hbs")
const path = require("path");
const bodyParser = require("body-parser");
var Spotify = require("spotify-web-api-js")
var s = new Spotify()

const SpotifyWebApi = require("spotify-web-api-node")
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

const app = express();


// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"])
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error)
    })


app.set("view engine", "hbs")
app.set("views", __dirname + "/views")
app.use(express.static(path.join(__dirname + "/public")));
// setting the spotify-api goes here:

// the routes go here:
const index = require("./routes/indexRoutes.js");
app.use("/", index);

app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
)