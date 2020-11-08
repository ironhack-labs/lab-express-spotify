require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
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
app.get("/", (req,res) => {
    res.render("index")
})

app.get("/search-results", (req,res) =>{
    const { artistName } = req.query;

    spotifyApi.searchArtists(artistName)
    .then(data => {
    //   console.log('The received data from the API: ', data.body.artists.items);
      const artists = data.body.artists.items;
      res.render("artist-search-results", {artists});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  })

  app.get("/albums/:id", (req,res) =>{
    const { id }= req.params;

    spotifyApi.getArtistAlbums(id)
    .then(data => {
      const albums = data.body.items
      res.render("albums", {albums});
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
  })

  app.get("/tracks/:idTrack", (req,res) => {
     const { idTrack } = req.params;

    spotifyApi.getAlbumTracks(idTrack)
    .then(data => {
        const tracks = data.body
        res.render("tracks", {tracks});
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
  })

app.listen(8080, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));
