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
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/artist-search", (req, res, next) => {
    let { artist } = req.query;
    spotifyApi
      .searchArtists(artist)
      .then((data) => {
        //console.log("The received data from the API: ", data.body.artists.items);
        res.render("artist-search-results", { artist: data.body.artists.items });
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  });
 
app.get("/albums/:artistId", (req, res, next) => {
    let albums = req.params.artistId;
    spotifyApi.getArtistAlbums(albums).then(
      function (data) {
        res.render("albums", { album: data.body.items });
      },
      function (err) {
        console.error(err);
      }
    );
});
 
app.get("/albums/:artistId/tracks", (req, res, next) => {
    let tracks = req.params.artistId;
    spotifyApi.getAlbumTracks(tracks, { limit: 5, offset: 1 }).then(
      function (data) {
        console.log(data.body.items);
        res.render("tracks", { track: data.body.items });
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
