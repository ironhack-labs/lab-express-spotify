require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
    res.render("index");
    console.log("home is working") 
  });


  app.get("/:artistName", (req, res, next) => {

    console.log(req.query.artistName);   //name of the artist in terminal
    console.log(req.params.artistName);  //"artist-search" in terminal

    spotifyApi
    .searchArtists(req.query.artistName)
    .then(artistDetails => {
      console.log('The received data from the API: ', artistDetails.body.artists.items);
      console.log(artistDetails.body.artists.items.id);
      res.render("artist-search-results", {selArtist : artistDetails});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


 app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.query.artistId)
  .then(function(artistAlbums) {
      console.log('Artist albums', artistAlbums.body);
      res.render("albums", {allAlbums: artistAlbums});
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
})




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
