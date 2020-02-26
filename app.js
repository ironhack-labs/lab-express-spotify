require('dotenv').config();
const path = require('path');

const express = require('express');
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

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
app.get("/", (req, res) => res.render("index"));

app.get("/artist-search", (req, res) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            res.render("artist-search-results", { data });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get('/albums/:id', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then(
        (data) => {
            res.render("albums", data.body );
        })
        .catch(error => console.log(error));
});

app.get('/tracks/:id', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then(
        (data) => {
            console.log(data.body);
            res.render("tracks", data.body );
        })
        .catch(error => console.log(error));
});




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
