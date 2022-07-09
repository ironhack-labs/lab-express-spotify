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
app.get("/", (req, res) => {
    res.render("home")
})

app.get("/artist-search", (req, res) => {
  spotifyApi.searchArtists(req.query.list)
    .then(data => {
      data = data.body.artists.items;

      return res.render("artist-search-results", {data})
    })
    .catch(error => console.log('The error while searching artists occurred: ', error))
  
})

app.get("/albums/:id", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id)
  .then((data) => {
    const albums = data.body.items;
    res.render('albums',{albums})
  })
  .catch(error => console.log('The error while searching artists occurred: ', error))
});

app.get("/tracks/:id", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id) 
    // { limit : 5, offset : 1 }) //--> added to the getalbumtracks method if we want to limit the number of tracks
  .then((data) => {
    const tracks = data.body.items;
    res.render('tracks',{tracks})
  })
  .catch(error => console.log('The error while searching artists occurred: ', error))
  
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
