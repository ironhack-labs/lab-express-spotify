require('dotenv').config();

const { response } = require('express');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyWebApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

//Connect to the API
spotifyWebApi
  .clientCredentialsGrant()
  .then((data) => spotifyWebApi.setAccessToken(data.body['access_token']))
  .catch(error => 
    console.log('Something went wrong when retrieving an access token', error)
);

app.get("/", (req, res) => {
    res.render("index");
  });

  //PURPOSE is to search the API for the 
  app.get('/artist-search', async (req, res) => {
    let foundArtists = await spotifyWebApi.searchArtists(req.query.artist);     //insert our query string into the search function
    console.log(foundArtists.body.artists.items);                               //console.log the search result variable
    let searchResults = foundArtists.body.artists.items;                        //here we search through the API step-by-step
    res.render("artist-page", { searchResults });                               //render the results on a new page as a promise
    // console.log(req.query.data.body);
  });

  //PURPOSE is to redirect the user to an album page, after user has clicked the album-button on the artist-page
  app.get("/albums/:artistId", async (req, res) => {
    let foundArtistAlbum = await spotifyWebApi.getArtistAlbums(req.params.artistId);
    console.log(foundArtistAlbum.body.items);
    const albums = foundArtistAlbum.body.items;
    res.render("albums", { albums });
  });

//   app.get("/artist-page", (req, res) => {
//     res.render("index");
//   });
  
//   spotifyApi.searchArtists('Love')
//   .then(function(data) {
//     console.log('Search artists by "Love"', data.body);
//   }, function(err) {
//     console.error(err);
//   });

// Our routes go here:
app.listen(5000, () => console.log('My Spotify project running on port 5000 🎧 🥁 🎸 🔊'));
