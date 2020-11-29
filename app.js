require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const  SpotifyWebApi  =  require ( 'spotify-web-api-node' ) ;
// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req,res) => {
    res.render("index")
});

// Iteration 3
app.get('/artist-search', (req, res) => {
    spotifyApi
  .searchArtists(req.query.artitst)
  .then(data => {
      const infoArtist = data.body.artists.items;
    //console.log('The received data from the API: ', infoArtist);
    
    res.render("artist-search-results",{infoArtist})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  // Iteration 4 View Albums
  app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const {artistId} = req.params
    spotifyApi
  .getArtistAlbums(artistId)
  .then(data => {
      const albums = data.body.items;
    //console.log('The received data from the API: ', albums);
    
    res.render("albums",{albums})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

  });

  // Iteration 5 
  app.get('/viewtracks/:artistTrack', (req, res, next) => {
   
    const {artistTrack} = req.params
    spotifyApi
  .getAlbumTracks(artistTrack)
  .then(data => {
      const list = data.body.items;
    //console.log('The received data from the API: ', data);
    
    res.render("viewtracks",{list})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
