require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
//const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));

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
})

app.get("/artist-search", (req, res, next) =>{
    const {search} = req.query;
    //console.log(req.query)

    spotifyApi
  .searchArtists(search)
  .then(data => {
    //console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const resultOfSearch = data.body.artists.items;
    //console.log(resultOfSearch);
    //console.log(resultOfSearch.images)
    res.render("artist-search-results",{resultOfSearch})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    //console.log(req.params)
    const {artistId} = req.params
    //console.log({artistId})
    spotifyApi.getArtistAlbums(artistId)
    .then(
      function(data) {
        //console.log('Artist albums', data.body);
        const album = data.body.items;
        res.render("albums", {album});
      },
      function(err) {
        console.error(err);
      }
    );
  });

app.get('/albums/:albumId/tracks', (req, res, next) => {
  console.log(req.params)
  const {albumId} = req.params
  spotifyApi.getAlbumTracks(albumId)
  .then(function(data) {
    console.log(data.body);
    const track = data.body.items;
    res.render("tracks", {track});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
