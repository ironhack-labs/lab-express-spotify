const express = require('express');
const hbs = require('hbs');



// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = '0cb8339562524291b7f115746f8950c1',
    clientSecret = '335f7e0a09e64f77a4bca88eab0873c8';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })





// the routes go here:
app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/artist', (req, res, next) => {
  spotifyApi.searchArtists(req.query.search)
  .then(data => {

    console.log("The received data from the API: ", data.body.artists.items);
    res.render('artist', {items: data.body.artists.items})
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then (data => {
    console.log("Artist Albums", data.body);
    res.render('albums', {items: data.body.items})
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});

app.get('/tracks/:tracksId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.tracksId)
  .then (data => {
    console.log("Artist Albums", data.body);
    res.render('tracks', {items: data.body.items})
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  })
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
