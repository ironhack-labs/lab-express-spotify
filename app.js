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

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
    console.log(req.query.artist)
    console.log("Receiving data on all artists that contain the searched word in their name from the API, data from the API: ", data.body);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    console.log("The searched artist is within these 'items': ", data.body.artists.items)
    for (let i = 0; i< data.body.artists.items.length; i++) {
      console.log(data.body.artists.items[i].name)
    }
      let allArtists = data.body.artists.items
      console.log("allArtists: ", {allArtists})
      console.log("images Array Example - images: ", allArtists[2].images)
      console.log("Image URL example: ", allArtists[2].images[0].url)
    res.render('artist-search-results', { allArtists } ) // "allArtists" in curly brackets cause it's an Array, but it should be an Object
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (req, res, next) => {
  // .getArtistAlbums() code goes here
  let id = req.params.id
  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      let albums = data.body.items
      console.log("req.params ", req.params)
      console.log("req.params.id: ", id)
      console.log("Artists info", data.body.items)
      res.render('albums', {albums})
    })
    .catch(err => console.log('The error while searching albums occurred: ', err))
}); 

app.get('/tracks/:id', (req, res, next) => {
  
 let albumId = req.params.id
 console.log("req.params: ", albumId)
  /*spotifyApi
    .getAlbumsTracks(id, { limit: 5, offset : 1 })
    .then(data => {
      console.log("Tracks info", data.body) */
      res.render('tracks', {albumId})
   /* })
    .catch(err => console.log('The error while searching tracks occurred: ', err)) */
}); 

app.listen(3005, () => console.log('My Spotify project running on port 3005 🎧 🥁 🎸 🔊'));
