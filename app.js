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

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Our routes go here:
app.get("/",(req,res,next)=>{
  res.render("home")
})

app.get("/artist-search",(req,res,next)=>{
  const artist = req.query.artist
    spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items[0]);
    const artistArray=data.body.artists.items
    res.render("artist-search-results", {artists: artistArray})

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  
})

app.get('/albums/:artistId', (req, res, next) => {
  //console.log(req.params.artistId)
  // Get Elvis' albums
spotifyApi.getArtistAlbums(req.params.artistId).then(
  function(data) {
    console.log('Artist albums', data.body.items[0].images);
    const albums= data.body.items
    res.render("albums.hbs", {albums: albums})
  },
  function(err) {
    console.error(err);
  }
);


});


 app.get("/view-tracks/:albumId",(req,res,next)=>{
  


  spotifyApi.getAlbumTracks(req.params.albumId) //id
  .then(function(data) {
    console.log(data.body.items[0]);
    const tracks= data.body.items
    res.render("view-tracks.hbs", {tracks})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
  
 })





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))