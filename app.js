const express = require('express');
const path = require('path');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '8980af125c6844b685431b63c42fdbf8',
  clientSecret = '58f1ffc7cb13495495c77d2b03ebed2e';
const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});
// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', (req, res, next) => {
  res.render('index');
})
app.get('/artists', (req, res, next) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(`artist:${artist}`)
    .then(data => {
      res.render('artists', data.body);
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})
app.get('/albums/:artistId', (req, res, next) => {
  let id = req.params.artistId;
  spotifyApi.getArtistAlbums(id)
    .then(data => {
      console.log(data.body);
      res.render('albums', data.body);
      console.log('Artist albums', data.body);
    })
    .catch(err => {
      console.error(err);
    })
});
app.get('/tracks/:albumId', (req, res, next) => {
  let albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      console.log(data.body);
      res.render('tracks', data.body);
    })
    .catch(err => {
      console.log('Something went wrong!', err);
    })
});
app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
