require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
//require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
// app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


//setting the spotify-api goes here:
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
app.get('/', (req, res) => {
    res.render("index")
});

app.get('/artist-search', (req, res) => {
    console.log('xxxxxxrequest', req.query);
    spotifyApi
        .searchArtists(req.query.artistName/*QUERY ARTIST*/) //define query parameter in input field's name
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items[0]);
            // 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search-results", {artists: data.body.artists.items});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/artists/:artistId/albums', (req, res) => {
    // .getArtistAlbums() code goes here
    console.log('Request Id:', req.params.artistId);
    spotifyApi.getArtistAlbums(req.params.artistId)
    //req.query.parameter has to match GET '/albums/:placeholder'
    .then(function(data) {
          console.log('Artist albums', data.body);
          res.render("albums", {artistAlbums: data.body.items})
        },
        function(err) {
          console.error(err);
        }
      );
  });

//':' is an Express syntex here comes a parameter
app.get('/albums/:albumId/tracks', (req, res) => {
    console.log('Requested Album:', req.params.albumId)
    spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    console.log(data.body);
    res.render("tracks", {albumTracks: data.body.items})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
 
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
