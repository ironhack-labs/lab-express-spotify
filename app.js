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
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get('/', (req, res) => {
    res.render('index', {artist:SpotifyWebApi} );
});

app.get('/artist-search', (req, res) => {
    spotifyApi
  .searchArtists(req.query.title)
  .then(data => {
    console.log('The received data from the API: ', data.body);
   //res.send(data.body);
   res.render('artist-search-results', {artists: data.body.artists.items});

  // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums', (req, res) => {
  spotifyApi
  .getArtistAlbums(req.query.id)
  .then((data) => {
      console.log('Album information', data.body);
      res.render('albums', {albums:data.body.items,});
    })
    .catch((err) => console.log("Error while searching an album occured", err));
});

app.get('/tracks', (req,res) => {
  spotifyApi
  .getAlbumTracks(req.query.trackId)
  .then((data) => {
//console.log('Album tracks:', data.body);
res.render('tracks', {tracks: data.body.items});
  } )
  .catch((err) => console.log("Error while searching for album's tracks", err));

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
