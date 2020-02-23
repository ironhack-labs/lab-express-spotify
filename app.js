require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
hbs.registerPartials(__dirname + "/views/partials");


// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

// Retrieve an access token
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

//home route to get the query
app.get("/", (req, res) => {
  res.render("index");
});

//Route to get the artists from Spotify API
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.term)
    .then(data => {
      const artists = {
        artist: data.body.artists.items
      };
      res.render("artist-search-results", artists);
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//Route to get the albums of the artists from Spotify API
app.get('/albums/:artistId', (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      const artist = {
        albums: data.body.items
      };
      res.render('albums', artist);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

//Route to get the traks from an album from Spotify API
app.get('/album/:albumId', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      const albums = {
        tracks: data.body.items
      };
      res.render('tracks', albums);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
