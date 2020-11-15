require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

  
// Retrieve an access tokenvari
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
      //console.log(data.body['access_token'])
      spotifyApi.setAccessToken(data.body['access_token'])
    })
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

//Our routes go here:
app.get("/", (req,res) => {
  res.render('index');
})

app.get("/artist-search", (req, res) => {
  // get artistName from search field
  const {artistName} = req.query;
  
  //find artist on spotify
  spotifyApi.searchArtists(artistName)
    .then( artistsFound => {
      //console.log(artistsFound.body.artists.items[0]);
      const artistAray = artistsFound.body.artists.items;
      res.render("artist-search-results", {artists: artistAray} )
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get("/albums/:id", (req,res) =>{
  const {id:artistId} = req.params

  spotifyApi.getArtistAlbums(artistId)
    .then(albumsFound => {
      const albums = albumsFound.body.items;
      //console.log(albums)
      res.render("albums", {albums})
    })
    .catch(err => console.log('The error while searching artists albums: ', err))
})

app.get("/albums/view-tracks/:id", (req,res) => {
  console.log('Arrived on this page')
  const {id} = req.params;
  spotifyApi.getAlbumTracks(id)
    .then(tracksFound =>{
      console.log(tracksFound.body.items)
      const {items} = tracksFound.body
      res.render("tracks", {items})
    })
    .catch(err => console.log('The error while searching artists albums songs: ', err))

  //res.render("index")
})



///////////////////////////////////////////////////// TEST ////////////////////////////////////////////////
// PARAMS UIT QUERY PARAM
// niet weet wat voor info je allemaal meekrijgt
app.get("/test-query-params", (req,res) => {
  // http://localhost:3000/test-query-params?id=test&test=123
  res.send(req.query);
})

// PARAMS UIT ROUTE
// alleen maar 1 specifieke param
app.get("/test-route-params/:name", (req,res) => {
  // http://localhost:3000/test-route-params/matt
  res.send(req.params);
})

// BOTH
app.get("/test/:name", (req,res) => {
  // http://localhost:3000/test/matt?id=test&test=123
  const response = {
      queryParams: req.query,
      routeParams: req.params
  }  
  res.send(response);
})

app.post("/post-test", (req, res) => {
  res.send(req.body) 
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
