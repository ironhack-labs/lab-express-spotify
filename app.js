require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

  
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));  

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')
  app.get("/", (req, res, next) => {
    res.render("index");
  });
  app.get("/results", (req, res, next) => {
    res.render("results");
  });

app.get("/artist-search", (req, res, next) => {
  console.log(req.query.artist)  
// setting the spotify-api goes here:
spotifyApi
.searchArtists(req.query.artist)
.then(data => {
      let spotifArtist = data.body.artists.items
    console.log('The received data from the API: ', spotifArtist);
    res.render('results', {spotifArtist})
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

// Our routes go here:
app.get('/albums/:id', (req, res, next) => {
    console.log(req.params.id)
    spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
        let albumsSpoty = data.body.items
        //console.log('The received data from the API: ', albumsSpoty);
        res.render('albums', {albumsSpoty})
    //console.log(data.body.items)
    })
  });


  app.get('/viewTracks/:id', (req, res, next) => {
    console.log(req.params.id)
    
    spotifyApi.getAlbumTracks(req.params.id, { limit : 10, offset : 1 })
    .then(data => {
        let tracksSpoty = data.body.items
        //console.log('The received data from the API: ', albumsSpoty);
        res.render('viewTracks', {tracksSpoty})
    //console.log(data.body.items)
    })
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
