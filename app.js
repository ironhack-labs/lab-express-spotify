require('dotenv').config();
const express = require('express');
const app = express();
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

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

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Our routes go here:

app.get('/', (req, res) => {

    res.render('index.hbs')

  });

// Route: ARTIST SEARCH
app.get('/artist-search', (req, res) => {
	//console.log(req.query.artist);
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      //console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results.hbs', {artistsResults: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

// Route: ALBUMS of ARTIST
app.get('/albums/:artistId', (req, res, next) => {
//console.log(req.params.artistId)
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
   //console.log(data.body.items)
    res.render('albums.hbs', {albums: data.body.items})
  })
});  

// Route: TRACKS of ALBUM
app.get('/tracks/:trackId', (req, res, next) => {
  //console.log(req.params.trackId);
  spotifyApi
  .getAlbumTracks(req.params.trackId)
  .then(data => {
    //console.log(data.body.items)
    res.render('tracks.hbs', {tracks: data.body.items})
  })
}); 

 app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
