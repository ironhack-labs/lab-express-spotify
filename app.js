require('dotenv').config();
const port = 3005
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
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

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
    res.render("index"); 
}); 

app.get("/artist-search", (req,res) => {
    const {artistName} = req.query;

    spotifyApi.searchArtists(artistName)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    const artists = data.body.artists.items
    res.render("artist-search-results", {artists})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req,res) => {
  const {id} = req.params;

  spotifyApi.searchArtists(id)
.then((data) => {
  const {items} = data.body;
  res.render("albums.hbs", {albums: items})
})
.catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(port, () => console.log(`My Spotify project running on port ${port} 🎧 🥁 🎸 🔊`));
