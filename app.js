require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
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

app.get("/", (req, res, next) => {
    res.render("homepage");
});

app.get("/artist-search", (req, res, next) => {
    let searchedArtist = req.query.artistName;

    spotifyApi
        .searchArtists(searchedArtist)
        .then((data) => {
            const artistsResults = data.body.artists.items;
            res.render("artist-search-results", { artistsResults });
        })
        .catch((err) =>
            console.log("The error while searching artists occurred: ", err)
        );
});

app.get("/albums/:artistId", (req, res, next) => {
    let artists = req.params.artistId;

    spotifyApi
        .getArtistAlbums(artists)
        .then((data) => {
            const albumList = data.body.items;
            res.render("albums", { albumList });
        })
        .catch((e) => console.log(e));
});

app.get("/tracks/:albumId", (req, res, next) => {
    let tracks = req.params.albumId;

    spotifyApi
        .getAlbumTracks(tracks)
        .then((data) => {
            const tracksList = data.body.items;
            res.render("tracks", { tracksList });
        })
        .catch((e) => console.log(e));
});

app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
