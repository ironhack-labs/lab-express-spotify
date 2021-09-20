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
    res.render("index")
})
app.get("/artist-search", (req, res) => {
  //  console.log(req.query)
  //  res.send(req.query)
const queryObj = req.query
const arti = queryObj.artist
console.log(arti)

  spotifyApi
  .searchArtists(arti)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    const arregloArti = data.body.artists.items
    console.log(arregloArti)
              //sin .hbs porque con views y __dirname ya no es necesario
    res.render("artist-search-results", {artist: arregloArti})
  }) 
  .catch(err => console.log('The error while searching artists occurred: ', err)); 
});
    
app.get('/albums/:artistId', (req, res, next) => { 
  //entiendo el trasfondo de id y query (no sale con este) pero no con params (?)
  const paramsAlb = req.params
  const artistId = paramsAlb.artistId
  console.log(req.params)
  spotifyApi
  .getArtistAlbums(artistId)
  .then(data => {
    res.render('albums', data.body)
  })
  .catch((e) => {
    console.log("Error recibiendo el álbum", e) })
});

app.get('/tracks/:albumId',(req, res) =>{
  const paramTrac = req.params
  const albumId = paramTrac.albumId
 spotifyApi
 .getAlbumTracks(albumId)
 .then(data => {
     res.render('tracks',data.body)
 })
 .catch(e => {
     console.log(e);
 })
 })

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


//