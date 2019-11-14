require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
const bodyParser = require("body-parser");


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));


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
app.get("/", (req, res) => {
    res.render('index')
})

app.get("/artists/", (req, res) => {
    let { artist } = req.query

    spotifyApi.searchArtists(artist)
        .then((data) => {
            return dataArr = data.body.artists.items;
        })
        .then((dataArr) => {
            res.render("artists", { dataArr })
        })
})

app.get("/albums/:id", (req, res) => {
    let idArtist = req.params.id;
    spotifyApi.getArtistAlbums(idArtist)
        .then((data) => {
            return albums = data.body.items;
        })
        .then((albums) => {
            res.render("albums", { albums })
        })
})


app.get("/tracks/:id", (req, res) => {
    let idAlbum = req.params.id;
    spotifyApi.getAlbumTracks(idAlbum)
        .then((data) => {
            return tracks = data.body.items;
            
        })
        .then((tracks) => {
            res.render("tracks", { tracks })
        })
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
