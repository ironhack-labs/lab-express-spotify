require('dotenv').config();
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
app.get("/", (req, res) => {
    res.render("home")
})

app.get("/artist-search", (req, res) => {
    const { artist } = req.query
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const searchResults = data.body.artists
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search-results", searchResults)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
    const { artistId } = req.params
    spotifyApi.getArtistAlbums(artistId).then(
        function (data) {
            const albums = data.body.items
            console.log("Artist albums: " + albums[0].images[0].url);
            res.render("albums", { albums })
        },
        function (err) {
            console.error(err);
        }
    );
});

app.get("/tracks/:trackId", (req, res) => {
    const { trackId } = req.params
    console.log("trackId: " + trackId)
    spotifyApi.getAlbumTracks(trackId, { limit: 5, offset: 1 })
        .then(function (data) {
            const tracks = data.body.items
            console.log("preview url: " + tracks[0].preview_url);
            res.render("tracks", { tracks })
        }, function (err) {
            console.log('Something went wrong!', err);
        });
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
