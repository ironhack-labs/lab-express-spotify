require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



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

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

    // Our routes go here:

app.get("/", (req, res) =>
    res.render("home")
);

app.get('/artist-search', (req, res) => {

spotifyApi
  .searchArtists(req.query.theArtistName)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render("artist-search-results", {artists: data.body.artists.items})
})
  .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get('/albums/:theId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getArtistAlbums(req.params.theId)
    .then(data => {
        res.render('albums', { albums: data.body.items });
        })
    .catch(err =>
          console.error(err))
});

app.get('/tracks/:someId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getAlbumTracks(req.params.someId)
    .then(data => {
        res.render('tracks', { tracks: data.body.items });
        })
    .catch(err =>
          console.error(err))
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
