require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

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

// Home page - search
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/artist-search", (req, res) => {
    const { artistName } = req.query;
    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            // console.log('The received data from the API: ', data.body);
            const artistData = data.body.artists.items;
            console.log(artistData);
            res.render("artist-search-results", { artistData })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get("/albums/:artistID", (req, res) => {
    const { artistID } = req.params;
    // console.log('params:', req.params);
    // console.log('albumID:', albumID)
    spotifyApi
        .getArtistAlbums(artistID)
        .then(data => {
            console.log('The received data from the API: ', data);
            const albumInfo = data.body.items
            console.log("**** album info ****", albumInfo, "*******");
            res.render("albums", { albumInfo })
        })
        .catch(err => console.log('The error while searching album occurred: ', err));
});

app.get("/tracks/:albumID", (req, res) => {
    const { albumID } = req.params;
    console.log('params:', req.params);
    console.log('albumID:', albumID)

    spotifyApi
        .getAlbumTracks(albumID)
        .then(data => {
            console.log('The received data from the API: ', data);
            const tracksInfo = data.body.items
            // console.log("****tracks ****", tracksInfo, "*******::");
            res.render("tracks", { tracksInfo })
        })
        .catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
