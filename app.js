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
app.get("/form", (req, res) => {

    res.render('form')


});

app.get("/artist-search", (req, res) => {

    console.log(req.query)
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            console.log(data.body.artists.items)
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search", { artists: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId", (req, res) => {

    console.log(req.params)
    //res.render("albums")

    spotifyApi
        .getArtistAlbums(req.params.artistId, { limit: 10 })
        .then((albums) => {
            console.log(albums.body.items)
            res.render("albums", { albums: albums.body.items })
        });
})

app.get("/tracks/:albumId", (req, res) => {

    spotifyApi
        .getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 })
        .then(tracks => {
            console.log(tracks.body.items);
            res.render("tracks", {tracks: tracks.body.items})
        }, function (err) {
            console.log('Something went wrong!', err);
        });
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));