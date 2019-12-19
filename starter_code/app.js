/*require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const CLIENT_ID = '1112ee5c82e54e98865079ff7a386ce2';
const CLIENT_SECRET = '6b8ea7c6dd9e4749b4cbb34e6c2a226f';

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
*/

require('dotenv').config();

const express = require("express");
const hbs = require("hbs");
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const CLIENT_ID = '1112ee5c82e54e98865079ff7a386ce2';
const CLIENT_SECRET = '6b8ea7c6dd9e4749b4cbb34e6c2a226f';



const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
// search for Artists
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    //console.log(data.body["access_token"]);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (req, res) => {
  // send the form to the user
  res.render("index");
});

app.get("/artists", (req, res) => {
  let artistData;

  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      //console.log("The received data from the API: ", data.body.artists.items);
      artistData = data.body.artists.items;
      res.render("artists", { artistData });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  let albumData;
  // .getArtistAlbums() code goes here
  console.log(req.params.artistId);
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function(data) {
      console.log('Artist albums', data.body.items);
      albumData = data.body.items;
      res.render("albums", { albumData });
    },
    function(err) {
      console.error(err);
    }
  );

});

// Search for tracks

app.get("/tracks/:albumId", (req, res, next) => {
  let trackData;
  // .getArtistAlbums() code goes here
  console.log(req.params.artistId);
  spotifyApi.getAlbumTracks(req.params.albumId).then(
    function(data) {
      console.log('tracks', data.body.items);
      trackData = data.body.items;
      res.render("tracks", { trackData });
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
