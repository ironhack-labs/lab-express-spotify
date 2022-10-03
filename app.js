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

app.get("/", (req, res, next) => {
    console.log("this is the homepage");    
    res.render("index");
});

app.get("/artist-search", (req, res, next) => {
    const { artist } = req.query;

    spotifyApi
    .searchArtists(artist)
    .then( (data) => {
        res.render("artist-search-results", {seachArr: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));    
})

app.get('/albums/:artistId', (req, res, next) => {
    const albums = req.params.artistId;

    spotifyApi.getArtistAlbums(albums)
    .then( (data) => {
        res.render("albums", {albumsArr: data.body.items})
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));    

});

app.get("/tracks/:albumId", (req, res, next) => {
    const tracks = req.params.albumId;
    
    spotifyApi.getAlbumTracks(tracks)
    .then( (data) => {
        res.render("tracks", {tracksArr: data.body.items})

    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));    
})


app.listen(3020, () => console.log('My Spotify project running on port 3010 🎧 🥁 🎸 🔊'));
