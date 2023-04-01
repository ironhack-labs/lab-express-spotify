require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


app.get('/', (req, res) => {
    res.render("main", {layout: 'layout'});
  })



app.post('/artist-search', (req,res) => {
   const {search} = req.body;
  spotifyApi
  .searchArtists(search)
  .then(data => {
    // console.log('The received data from the API: ', data.body.artists);
    let result = data.body.artists.items;
    // console.log(result);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
   res.render("artist-search-results", {result: result});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.post('/albums/:artistId', (req,res, next) => {
  const {artistId} = req.params;
  // console.log(artistId);
spotifyApi.getArtistAlbums(artistId).then(
  function(data) {
    // console.log('Artist albums', data.body);
    res.render("albums", {albums: data.body.items})
  },
  function(err) {
    console.error(err);
  }
);
})

app.post('/tracks/:albumId', (req,res,next) => {
  const {albumId} = req.params;
  spotifyApi.getAlbumTracks(albumId, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body);
    res.render("tracks", {tracks: data.body.items});
  }, function(err) {
    console.log('Something went wrong!', err);
  });

})

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
