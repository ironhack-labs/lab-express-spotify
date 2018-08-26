const express = require("express");
const app = express();
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const path = require("path");
const bodyParser = require("body-parser");

// Remember to paste here your credentials
const clientId = "81e6b3746f084a8ea77d2255325e41dd",
    clientSecret = "dc25ce943a164f0d92f435c8e71b8d85";

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views/layouts"));
app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(path.join(__dirname, "./views/partials"));

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
    function(data) {
        spotifyApi.setAccessToken(data.body["access_token"]);
    },
    function(err) {
        console.log("Something went wrong when retrieving an access token", err);
    }
);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/artists", (req, res) => {
    const { artist } = req.query;
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            // console.log("Data: ", data);
            // console.log("Items: ", data.body.artists.items);
            // console.log("Name: ", data.body.artists.items);
            // console.log("Artist: ", artist);
            res.render("artists", { data: data.body.artists.items });
            console.log("I render bullshit!");
        })
        .catch(err => {
            console.log(error);
        });
});

// app.post("/artists", (req, res) => {
// });

app.listen(3000);
