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
// Route for Home
app.get("/", (req, res, next) => {
    res.render("home");
});

// Route for artists
app.get('/artist-search', (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      const artists = data.body.artists.items;
      res.render('artist-search-results', { artists });
    })
    .catch(e => {
      console.log("The error while searching artists occured", e);
  });
});

// Route for albums  //For some reason I cannot manage to get the albums to appear. Can't understund the spotify-web-api-node documentation.
app.get('/albums/:artistId', (req, res, next) => {

  // .getArtistAlbums() code goes here

    const artistId = req.params.artistId;

    spotifyApi.getArtistAlbums( artistId, {limit: 20, offset: 20})
      .then(data => {
        res.render('albums', {albums: data.body.items});
      })
      .catch(e => {
        console.log("The error while searchng albums occured", e);
      })
});


// Route for tracks
app.get('/tracks/:albumId', (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi.getAlbumTracks(albumId)
  .then(data => {
    res.render('tracks', {tracks: data.body.items});
  })
  .catch(e => {
    console.log("The error while searching tracks occured", e);
  })
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
