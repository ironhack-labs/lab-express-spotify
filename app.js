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
    // clientId: process.env.CLIENT_ID,
    // clientSecret: process.env.CLIENT_SECRET
    clientId: "c7727f4c69564a4d902028b5c367d8ff",
    clientSecret: "d416d95285744c6690d1fbbf6e628d45"
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/artist-search', function(req, res, next) {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search-results", { result : data.body.artists.items })
  })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi
  .getArtistAlbums(req.params.id)
  .then(function(data) {
    console.log(data.body.items)
    res.render('albums', { result : data.body.items })
  })
  .catch(err => console.log('Error retrieving albums', err));
});

app.get('/tracks/:id', (req, res) => {
    spotifyApi
    .getAlbumTracks(req.params.id)
    .then(function(data) {
        // console.log(data.body.items)
        res.render('tracks', { result : data.body.items })
    })
    .catch(err => console.log('Error retrieving tracks', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
