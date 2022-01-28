require("dotenv").config();

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
app.get('/', (req, res, next) => {
    res.render('index');
});
  
app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            const artists = data.body.artists.items;
            console.log(artists.forEach(element => console.log(element)));
            res.render("artist-search-results", { artists });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.query.search)
        .then(function(data) {
            return data.body.albums.map(function(a) {
            return a.id;
        });
    })
    .then(function(albums) {
        return spotifyApi.getAlbums(albums);
    })
    .then(function(data) {
        console.log(data.body);
    });
});
  



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
