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

app.get("/", (req, res) => {
    res.render("index", { title: "index" });
});

app.get("/artist-search", (req, res) => {
    //console.log(req.query.search)
    spotifyApi
        .searchArtists(req.query.search)           
        .then(data => {
        //console.log('The received data from the API: ', data.body.artists.items);
        //console.log('The received data from the API2: ', data.body.artists.items[0].href);
        //console.log('The received data from the API3: ', data.body.artists.items.name);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render("artist-search-results", {artists: data.body.artists.items, query: req.query.search});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get("/albums/:artistId", (req, res, next) => {
    //console.log(req.params.artistId)
    spotifyApi

        // This was were I thought there was something wrong with the Api, but after we spoke I found there were two 
        // getArtistAlbums" in the documentation and the other one works fine
        
        .getArtistAlbums(req.params.artistId)
        .then(function(data) {
          //console.log('Artist albums', data.body.items);
          res.render("albums", {albums: data.body.items});
        }, function(err) {
          console.error(err);
        });    
})

app.get("/tracks/:albumId", (req, res, next) => {
  console.log("Ping")
  console.log(req.params.albumId)
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(function(data) {
      console.log(data.body);
      console.log(data.body.items[0].preview_url)
      res.render("tracks", {tracks: data.body.items});
    }, function(err) {
      console.log('Something went wrong!', err);
    });
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
