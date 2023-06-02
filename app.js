require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

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
app.get("/", (req, res) => {
      res.render("index");
})

app.get("/artist-search/", (req, res) => {

    console.log(req.query);
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
        // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render("artist-search-results", data.body);
        console.log('The received data from the API: ', data.body);
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
      res.send("Search failed with error 🫤: " + err);
    });
})

app.get("/albums/:artistId", (req, res) => {

  console.log(req.query);
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("albums", data.body);
      console.log('The received data from the API: ', data.body);
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
    res.send("Search failed with error 🫤: " + err);
  });
})

app.get("/album/:albumId", (req, res) => {

  console.log(req.query);
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      console.log('The received data from the API: ', data.body);
      res.render("album-tracks", data.body);
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
    res.send("Search failed with error 🫤: " + err);
  });
})


app.listen(3000, () => console.log('My Spotify project running on http://localhost:3000/ 🎧 🥁 🎸 🔊'));
