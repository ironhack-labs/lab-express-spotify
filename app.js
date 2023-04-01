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

// home route 
app.get("/", (req, res) => {
    res.render("home");
  });

// artist search route 
app.get("/artist-search", (req, res) => {
    const artist = req.query.artist;
    spotifyApi
        .searchArtists(artist)
        .then(data => {
          res.render("artist-search-results", {artists: data.body.artists.items});
      })
        .catch(err => console.log('The error while searching artists occurred: ', err)); 
});

//getArtistAlbums route
app.get('/albums/:artistId', (req, res, next) => {
    artistId = req.params.artistId;
    spotifyApi
      .getArtistAlbums(artistId)
      .then(data => {
          res.render('albums', {albums: data.body.items});
        })
      .catch(err => console.log('The error while getting artist albums occurred: ', err)); 
});



//getAlbumTracks route
app.get('/tracks/:tracksId', (req, res, next) => {
  tracksId = req.params.tracksId;
  spotifyApi
    .getAlbumTracks(tracksId)
    .then(data => {
      res.render('tracks', {tracks: data.body.items});
      })
    .catch(err => console.log('The error while getting album tracks occurred: ', err)); 
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
