const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');
app.set('view engine','hbs');
app.set('views', `${__dirname}/views`);
app.use(bodyParser.urlencoded({ extended: true }));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '556e6700948044409bbd5b9b63ab6786',
    clientSecret = 'b45f674a323249baaa4c29ce7d11a064';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});




app.get('/',(req,res) => {  
  res.render("index")
});

app.get('/artists',(req,res) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist)
    .then(artista => {
      

      res.render("artists", {artista})
    })
    .catch(err => {
      console.log("No se encuentra el artista", err)
    })

});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(album => {
    res.render("albums", {album})
  })
  .catch(err => {
    console.log("No se encuentra el artista", err)
  })
});

app.get('/tracks/:albumId', (req, res) => {
  console.log(req.params.albumId)
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(tracks => {
    res.render("tracks", {tracks})
  })
  .catch(err => {
    console.log("No se encuentra la track", err)
  })
});




const port = 3000;
app.listen(port, () => console.log(`Connected to ${port}`) );
