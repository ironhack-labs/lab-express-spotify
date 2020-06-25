require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require("path");
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// setting the spotify-api goes here:


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials")
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
    res.render("home")
});



app.get("/artist-search", (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            let artists = data.body.artists.items;
            console.log(artists)
            res.render('artist-search', { artists })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get("/album/:artistId", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId).then(
        function (data) {
            console.log('Artist albums', data.body.items);
            let albums = data.body.items
            res.render('album', { albums })
        },
        function (err) {
            console.error(err);
        }
    );
});

app.get("/tracks/:albumId", (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 })
        .then(function (data) {
            let tracks = data.body.items
            res.render('tracks', { tracks })
        }, function (err) {
            console.log('Something went wrong!', err);
        });

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));