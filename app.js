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

// Route HOME / LANDING page
app.get("/", (req, res, next) => {
    res.render("index");
});

// ROUTE find and show Artists (Iteration 3)
app.get("/artist-search", (req, res, next) => {
    //console.log(req.query.searchQuery);
    const searchQuery = req.query.searchQuery
    spotifyApi.searchArtists(searchQuery)
    //console.log("Artist Info: ")
    //console.log(data.body.artists.items);
        .then((data) => {
            let filter = {artists: data.body.artists.items};
            res.render("artist-search-results", filter);
        })
        .catch(err => console.log("The error while searching artists occurred: ", err));
});

// ROUTE view albums (iteration 4)
app.get("/albums/:id", (req, res, next) => {
    //console.log(req.params.id);
    const artistId = req.params.id;
    spotifyApi.getArtistAlbums(artistId)
    .then((data) => {
        //console.log("Artist albums: ")
        //console.log(data.body.items);
        let filter = {albums: data.body.items};
        res.render("albums", filter);
    })
    .catch(err => console.log("The error while searching albums occurred: ", err));
});

// ROUTE Get tracks in an album (iteration 5)
app.get("/tracks/:id", (req, res, next) => {
    //console.log(req.params.id);
    const albumId = req.params.id;
    spotifyApi.getAlbumTracks(albumId) // , { limit : 5, offset : 1 }
    .then((data) => {
        //console.log("Tracks: ");
        //console.log(data.body.items);
        filter = {tracks: data.body.items};
        res.render("tracks", filter)
    })
    .catch(err => console.log("The error while searching tracks occurred: ", err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));