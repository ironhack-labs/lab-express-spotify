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

// Iteration 3 | Search for an Artist
// Step 1 | Create a Homepage
app.get('/', (req,res)=>{
    res.render('index');
}); 

// Step 2 | Display results for artist search
app.get("/artist-search", async (req, res) => {
    try {
      let response = await spotifyApi.searchArtists(req.query.searchTerm);
      //console.log(response.body.artists.items)
     // result becomes new name for response.body etc
      res.render("artist-search-results", { result: response.body.artists.items }); 
    } catch (error) {
      console.error(error);
    }
  });


/*
app.get('/artist-search', (req, res) => {
    const searchTerm = req.query.searchTerm; 
    spotifyApi
      .searchArtists(searchTerm) 
      .then(data => {
        const artists = response.body.artists.items; 
        console.log('The received data from the API: ', artists);
        res.render('artist-search-results', { artists }); 
      })
      .catch(err => console.log(err));
  });
  */

// Iteration 4 | View Albums

  app.get("/albums/:artistId", async (req, res) => {
    try {
      let responseAlbums = await spotifyApi.getArtistAlbums(req.params.artistId);
      let allAlbums = responseAlbums.body.items;
      //console.log(allAlbums[0].images);
      res.render("albums", { allAlbums });
    } catch (error) {
      console.error(error);
    }
  });

  
  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
