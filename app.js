require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
//const path = require('path');
//hbs.registerPartials(path.join(__dirname, 'views/partials'));

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
app.get("/", (req, res, next) => {
    res.render("index");
});


app.get("/artist-search", (req, res, next) => {
    const {artist} = req.query
    console.log(artist)
    spotifyApi
  .searchArtists(artist)
  .then(artist => {
       //res.send(artist)
    console.log('The received data from the API: ', artist);
    res.render("artist-search-results", {artist: artist.body.artists.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

});


app.get("/albums/:id", (req, res, next) => {
    const {id} = req.params
    //res.send(id)
    spotifyApi.getArtistAlbums(id)
    .then(artistAlbums => {
        //res.send(artistAlbums.body);
        res.render("albums", {albums: artistAlbums.body.items});
    })
});


app.get("/tracks/:id", (req, res, next) => {
    const {id} = req.params
    //res.send(id)
    spotifyApi.getAlbumTracks(id)
    .then(albumTracks => {
        //res.send(albumTracks.body);
        res.render("tracks", {tracks: albumTracks.body.items});
    })
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
