require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended : true}))

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

app.get("/", (req, res) => {
    spotifyApi
        .clientCredentialsGrant()
        .then(data => {spotifyApi.setAccessToken(data.body['access_token']); console.log(data.body['access_token'])})
        .catch(error => console.log('Something went wrong when retrieving an access token', error));
    res.render("homePage");
})

app.get("/artist-search", (req, res) => {
    const {artist} = req.query;
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const artists = data.body.artists.items;
            res.render("artist-search-results", {artists})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums", (req, res) => {
    const {artist_id} = req.query;
    spotifyApi
        .getArtistAlbums(artist_id, {limit: 50, album_type: "album"})
        .then(data => {
            const albums = data.body.items.filter(object => object.album_type === "album");
            res.render("albums", {albums})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/tracks", (req, res) => {
    const {album_id} = req.query;
    spotifyApi
    .getAlbumTracks(album_id)
    .then(data => {
        const tracks = data.body.items;
        res.render("tracks", {tracks})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));