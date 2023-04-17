require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node")

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectURI: "http://localhost:3000/"
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", function (req, res) {
    res.render("home.hbs", { title: "Home", layout: false })
})

app.get("/artist-search", function (req, res) {
    const queryString = req.query.q
    spotifyApi.searchArtists(queryString)
    .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    res.render("artist-search-results.hbs", { title: "Search-Results", layout: false, artists: data.body.artists.items })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    let id = req.params.artistId
    spotifyApi.getArtistAlbums(id)
    .then(data => {
        console.log('Artist albums', data.body);
        res.render("albums.hbs", { title: "Artists albums", layout: false, albums: data.body.items})
    })
    .catch(err => console.log('The error while displaying albums occurred: ', err));
  });

app.get("/album-tracks/:albumId", (req, res, next) => {
    let albumId = req.params.albumId
    spotifyApi.getAlbumTracks(albumId)
    .then(data => {
        console.log("album tracks", data.body)
        res.render("album-tracks.hbs", { title: "Album tracks", layout: false, tracks: data.body.items })
    })
    .catch(err => console.log('The error while displaying tracks occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
