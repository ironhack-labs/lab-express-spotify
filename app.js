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
    .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
    .catch(error => console.log("Something went wrong when retrieving an access token", error));


// Route to Index
app.get("/", (req, res) => res.render("index"));

// Iteration 3 – Complete – Route from Index.hbs Search Form to Artist-Search-Results.hbs
// Was able to display artist name, image and button, however, unable to route "View Albums" button to albums page
app.get("/artist-search", (req, res) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
    console.log("The received data from the API: ", data.body);
    
    // Display Results on Artist-Search-Results Page
    res.render("artist-search-results", {artistResults: data.body.artists.items}); 
    
    // Experimenation Area
    // console.log("What I'm specifically requesting from the API: ", data.body.artists.items[id]); // Couldn't figure out how to access id property within items (for later)
    })
  .catch(err => console.log("The error while searching artists occurred: ", err));
});



// Iteration 4 – Incomplete – Route from View Albums Button to Album.hbs page
// Created "View Albums" button on "artist-search-results" page, however unable to route this to "albums.hbs"
// Main Problem: Identifying proper syntax for dyanmic routing
app.get('/albums/:artistId', (req, res, next) => { // Uncertain about this line
  spotifyApi
  .getArtistAlbums(req.params.artistId) // Uncertain about this line
  .then(data => {
    console.log('Artist albums', data.body);
  }, function(err) {
    console.error(err);
  });
});




app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
