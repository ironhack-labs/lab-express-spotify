require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
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
    res.render("search");
})

app.get("/artist-search", (req, res) => {
    const searchQuery = req.query.q
    console.log(searchQuery)
    spotifyApi
        .searchArtists(searchQuery)
        .then(data => {
            const artistList = data.body.artists.items;
            res.render("artist-search-results", {artistList})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get("/albums/:id", (req, res) => {
    let artistId = req.params.id;
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            const albumsList = data.body.items;
            res.render("albums", {albumsList})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get("/albums/tracks/:id", (req, res) => {
    let albumId = req.params.id;
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            const trackList = data.body.items;
            res.render("tracks", {trackList})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));