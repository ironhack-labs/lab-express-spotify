require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require("spotify-web-api-node");

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

app.get('/', (req, res) => {
  console.log('index loading');
  
  res.render('index');
});


app.get('/artist-search', (req, res) => {
  
  spotifyApi
    .searchArtists(req.query.artistName)
    .then(apiResponse => {
      console.log('finding artists');
      const artists = apiResponse.body.artists.items;
      // console.log(artists);
      // console.log(artists[0].images[0].url)
      
      res.render('artist-search-results', {artists: artists})
    })
    .catch(error => console.log(error));
})

app.get('/albums/:artistId',(req,res) => {
  console.log('finding albums')
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(apiResponse => {
      const artistAlbums = apiResponse.body.items
      // console.log(artistAlbums[0]);
      
      res.render('albums', {artistAlbums})
    })
})


app.get('/tracks/:albumId',(req,res) => {
  console.log('finding tracks')
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(apiResponse => {
      const albumTracks = apiResponse.body.items;
      // albumTracks.forEach(track => console.log(track.name))
      console.log(albumTracks[0])

        res.render('tracks', {albumTracks})
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

