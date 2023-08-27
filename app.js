require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
    .clientCredentialsGrant()
    .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
    .catch((e) => console.log(e));

app.get("/", (req, res, next) => {
    res.render("homepage");
});

app.get("/artist-search", (req, res, next) => {
    let artist = req.query.artistName;

    spotifyApi
        .searchArtists(artist)
        .then((data) => {
            const artistList = data.body.artists.items;
            res.render("artist-search-results", { artistList });
        })
        .catch((e) => console.log(e));
});

app.get("/albums/:artistId", (req, res, next) => {
    let albums = req.params.artistId;

    spotifyApi
        .getArtistAlbums(albums)
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
            const trackList = data.body.items;
            res.render("tracks", { trackList });
        })
        .catch((e) => console.log(e));
});

app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
