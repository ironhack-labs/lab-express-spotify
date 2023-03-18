require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require("spotify-web-api-node");


// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Register the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, '/views/partials'));

// Our routes go here:

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/artist-search", (req, res) => {
    const {artist} = req.query;

    spotifyApi.searchArtists(artist)
        .then(data => {
            const artistsData = data.body.artists.items;
            res.render("artist-search-result", {artistsArr: artistsData, artist: artist});
        })
        .catch(error => {
            res.render("no-page")
            console.log(error);
        });
});

app.get("/albuns/:artistId", (req, res) => {
    const {artistId} = req.params;

    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            const albunsArr = data.body.items;
            res.render("albuns", {albuns: albunsArr})
        })
        .catch(error => {
            res.render("no-page")
            console.log(error);
        });
});

app.get("/tracks/:albumId", (req, res) => {
    const {albumId} = req.params;

    spotifyApi.getAlbumTracks(albumId)
        .then(data => {
            const tracksArr = data.body.items;
            const albumName = data.body;
            console.log(albumName);
            res.render("tracks", {tracks: tracksArr});
        })
        .catch(error => {
            res.render("no-page")
            console.log(error);
        });
});

app.get("/*", (req, res) => {
    res.render("no-page");
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
