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

//STEP 1: this app.get + layout.hbs 
// Important!!! layout.hbs (with this name in lower case) must be always created but 
// not used. This page is necessary for hbs to work. It's a complete page with body
// only with {{{body}}}
// the other pages hbs are called but NEVER the layout.hbs that hbs uses for rendering
// the other pages.

app.get("/", (req, res, next) => {
    res.render("form.hbs");
})

//STEP 2: Display results

app.get("/artist-search", (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.search)
  .then(data => {
    res.render('artist-search-results', {data: data.body.artists.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

// Iteration 4 - View albums.

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(albums => {
    // console.log('The received albums are: ', albums.body);
    // console.log('External urls: ', albums.body.items[0].external_urls);
    // console.log('Images: ', albums.body.items[0].images[0]);
    res.render('albums', {albums: albums.body.items});
  });
});

// Iteration 5 - View tracks.

app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(tracks => {
    console.log('Tracks ext urls: ', tracks.body.items[0].external_urls);
    res.render('tracks', {tracks: tracks.body.items});
  });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
