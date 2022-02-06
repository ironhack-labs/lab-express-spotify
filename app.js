require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Register the location for handlebars partials here:

hbs.registerPartials(__dirname + "/views/partials");


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
// index route
app.get('/', (req, res) => {
  res.render("index", {
    doctitle: "Home Page",
    });
  });

// /artist-search route

// localhost:3000/artist-search?term=kooks
app.get('/artist-search', (req, res) => {
  let artistSearch = req.query.term; // "kooks"
  console.log("Searching for " + artistSearch);
  spotifyApi.searchArtists(artistSearch)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render("artist-search-results", {
        doctitle: 'Artist Search', 
        results: data.body.artists.items
      })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

// albums route
app.get('/albums/:artistId', (req, res) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      console.log('Here is the ', data.body)
      res.render('albums', {
        results: data.body.items,
        name: data.body.items[0].artists[0].name
      })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});


// tracks route
app.get('/tracks/:albumId', (req, res) => {
  let albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      console.log('Tracks: ', data.body)
      res.render('track-information', {
        results: data.body.items
      })
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));

})






app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
