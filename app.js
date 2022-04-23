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
});


spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res, next) => {
    res.render("home");

})

app.get("/artist-search-results", (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
        console.log('The received data from the API: ', data.body);
        res.render("artist-search-results.hbs", data.body)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render("albums.hbs", {albums: data.body})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get("/tracks/:albumId", (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId, {
                limit: 5,
                offset: 1
            })
        .then((data) => {
                console.log(data.body);
                req.render("tracks")
            })
        .catch(err => console.log('Something went wrong!', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
