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
app.get("/", (req, res, next) => {
    res.render("index");
  });
app.get('/artist-search', (req, res) => {
    console.log('artista', req.query.artist);
    const artista = req.query.artist;
   spotifyApi.searchArtists(artista)
    .then(function(data) {
      const artistArray = data.body.artists.items;
      console.log(artistArray);
      res.render("artist-search-results", {artistArray});
    
    }, function(err) {
      console.error(err);
    });
  })

  app.get("/albums/:id", (req, res) => {
    let idOfArtist = req.params.id;
    spotifyApi
        .getArtistAlbums(idOfArtist)
        .then(data => {
            const listaAlbums = data.body.items;
            res.render("albums", {listaAlbums})
        })
        .catch(err => console.log('error: ', err))
})

app.get("/albums/tracks/:id", (req, res) => {
    let albumId = req.params.id;
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            console.log(data.body.items)
            const trackList = data.body.items;
            res.render("tracks", {trackList})
        })
        .catch(err => console.log('Error', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));