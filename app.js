require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/artist-search", (req, res) => {
    spotifyApi
    .searchArtists(req.query["artistName"])
    .then(data => {
        res.render("artist-search-results", {artistsList: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then(albumInfo => {
        res.render("albums", {albumList: albumInfo.body.items});
        console.log(albumInfo.body);
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.get("/tracks/:id", (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then(tracksInfo => {
        res.render("tracks", {trackList: tracksInfo.body.items});
        console.log(tracksInfo.body);
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
