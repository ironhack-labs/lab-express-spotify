require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
// Home:
app.get("/", (req, res, next) => res.render("index.hbs"));

app.get("/artist-search", (req, res, next) => {
    const {queryArtist} = req.query;
    spotifyApi
    .searchArtists(queryArtist)
    .then(data => {
        console.log('The received data from the API: ', data.body.artists.items[0]);
        res.render("artist-search-results.hbs", {artist: data.body.artists.items});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

// Albums:
app.get('/albums/:artistId', (req, res, next) => {
   const {artistId} = req.params;
   spotifyApi
   .getArtistAlbums(artistId)
   .then(data => {
    console.log('Artist albums', data.body.items);
    res.render("albums.hbs", {albums: data.body.items})
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
});

//Tracks
app.get('/tracks/:albumsId', (req, res, next) => {
  const {albumsId} = req.params;
  spotifyApi.getAlbumTracks(albumsId)
  .then(data => {
    console.log(data.body);
    res.render("tracks.hbs", {tracks: data.body.items})
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
