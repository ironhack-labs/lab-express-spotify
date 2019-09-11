require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");



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
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:


app.get("/", (req, res, next) => {
  res.render("home");
});


app.get("/artists", (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist).then(
    artist => {
      console.log(artist)
      res.render("artists", {artists:artist.body.artists.items})
    }
  ).catch(error => {
    console.log(error)
  })
});


app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    albums => {
      console.log(albums)
    res.render("albums", {albums: albums.body.items})
  }).catch(error => {
    console.log(error)
  })
})


app.get("/songs/:songId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.songId).then(
    songs => {
      console.log(songs)
    res.render("songs", {songs: songs.body.items})
  }).catch(error => {
    console.log(error)
  })
})





app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
