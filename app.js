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

//iteration 1

app.get('/', (req, res) => {
  res.render('index');
  
});

//Iteration 2

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render("artist-search-results", {artistsNames: data.body.artists.items} );
    })
      .catch(err => console.log('The error while searching artists occurred: ', err));
    })

//Iteration 3

app.get('/albums/:id', (req, res) => {
  let {id} = req.params;
  spotifyApi
  .getArtistAlbums(id)
  .then((data) => {
      console.log("The received data from the API: ", data.body.items);
      res.render('album', {result: data.body.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:id', (req, res) => {
  let {id} = req.params;
  spotifyApi
  .getAlbumTracks(id)
  .then((data) => {
      console.log("The received data from the API: ", data.body.items);
      res.render('tracks', {result: data.body.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

// Iteration 4



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
