const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = 'f3db23e0e84a45dd8c45a14356ddda35',
    clientSecret = '315ba7bea2084c779be45b959fb0ff3c';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })





// the routes go here:
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      res.render('artists', {searchedArtists: data.body.artists.items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    console.log('Artist albums', data.body.items);
    res.render('albums', {artistAlbums: data.body.items})
  }, function(err) {
    console.error(err);
  });
})

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then((data) => {
    console.log(data.body);
    res.render('tracks', { albumTracks: data.body.items})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
