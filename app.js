require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const path = require("path");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + `/views/partials`);
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.song)
    .then(data => {
      let search = data.body.artists.items;
      // console.log('The received data from the API: ', search);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', { search });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (req, res, next) => {
  // console.log(req.params.id)
  spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
      var album = data.body.items;
      // console.log(album);
      res.render('albums.hbs', { album });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:id', (req, res, next) => {
  // console.log(req.params.id)
  spotifyApi.getAlbumTracks(req.params.id)
    .then(data => {
      var album = data.body.items;
      console.log(album[0]);
      res.render('tracks.hbs', { album });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
