require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");


// Spotify connection
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
app.get("/", (req, res, next) => res.render("index"));

app.get("/artists", (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(datafromAPI => {
            res.render("artist-search-results", {
                artistsresults: datafromAPI.body.artists.items
            });
        }, function (err) {
            console.error(err);
        });
});

app.get("/albums/:artistIdentifier", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistIdentifier)
        .then(datafromAPI => {
            res.render("albums", {
                albums: datafromAPI.body.items
            })
        }, function (err) {
            console.error(err);
        });
});

app.get("/tracks/:albumIdentifier", (req, res, next) => {

    spotifyApi.getAlbumTracks(req.params.albumIdentifier)
        .then(datafromAPI => {
            res.render("tracks", {
                tracks: datafromAPI.body.items
                
            })
        }, function (err) {
            console.error(err);
        });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));