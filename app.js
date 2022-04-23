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

// create route for home page
app.get("/", (req, res, next) => {
    res.render("home");
});

// create route for artists
app.get("/artist-search", (req, res, next) => {
    const artistName = req.query.artistName;
    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items[0].id);
            res.render("artist-search-results", { results: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

// create route for albums
app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            // console.log('The received data from the API: ', data.body.items);
            res.render("albums", { albums: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

// create route for tracks
app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            console.log('The received data from the API: ', data.body.items[0]);
            res.render("tracks", { tracks: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
