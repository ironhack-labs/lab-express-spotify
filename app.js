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
app.get("/", (req, res) => {
    res.render("home");
})

app.get("/artist-search", (req, res, next) => {
    spotifyApi
      .searchArtists(req.query.name)
      .then(data => {
        console.log('The received data from the API: ', data.body.artists);
        res.render("artist-search-results", {data: data.body.artists.items});
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistID", (req, res) => {
    spotifyApi
      .getArtistAlbums(req.params.artistID)
      .then(data => {
        const artist = data.body.items[0].artists[0].name;
        const albums = {
            artist: artist,
            albums: data.body.items
        }
        console.log('The received data from the API: ', data.body.items);
        res.render("albums", {albums});
      })
      .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.get("/tracks/:albumID", (req, res) => {
    spotifyApi
      .getAlbumTracks(req.params.albumID)
      .then(data => {
        console.log('The received data from the API: ', data.body);
        res.render("tracks", {track: data.body.items});
      })
      .catch(err => console.log('The error while searching tracks occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));