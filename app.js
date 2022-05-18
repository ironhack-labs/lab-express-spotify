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

app.get('/', (req, res) => {
  res.render('home');
}); 

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistSearch)
    .then(data => {
      const artistObj = data.body.artists.items;
      res.render('artist-search-results', {artistObj});
    })
    .catch(err => console.log(err))
});

app.get("/albums/:artistsId", (req, res) => {
  spotifyApi
  .getArtistAlbums(req.params.artistsId)
  .then((albumData) => {
    const findAlbums = albumData.body.items;
    res.render("albums", { findAlbums });
  })
  .catch((err) => console.error("Error:", err));
}); 

app.get("/tracks/:trackId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.trackId, { limit: 10, offset: 1 })
    .then((trackData) => {
      res.render("tracks", { trackData: trackData.body.items });
    })
    .catch((err) => console.error("Error:", err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000'));