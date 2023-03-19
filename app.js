require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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

// Iteration 3 
// Step 1

app.get("/", (req, res, next) => {
    res.render("home");
});


// Step 2

app.get("/artist-search", (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      //console.log('The received data from the API: ', data.body.artists);
      console.log('The received data from the API: ', data.body.artists.items);
      res.render("artist-search-results", data.body.artists);
    })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


//Iteration 4

app.get("/albums/:artistId", (req, res, next) => {
    let artistId = req.params.artistId;
    spotifyApi
      .getArtistAlbums(artistId)
      .then((artist) => {
        console.log(`Artist albums from API:`, artist.body);
        res.render("albums", artist.body);
      })
      .catch((err) =>
        console.log("The error while searching albums occurred: ", err)
      );
})


// Iteration 5

app.get("/track-info/:trackId", (req, res) => {
    let trackId = req.params.trackId;
    spotifyApi
      .getAlbumTracks(trackId)
      .then(album => {
       console.log(`Album tracks from API:`, album.body);
        res.render("track-info", album.body );
      })
      .catch((err) =>
        console.log("The error while track albums occurred: ", err)
      );
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
