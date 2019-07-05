const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials('./views/partials');

const spotifyApi = new SpotifyWebApi({
  clientId: '9e90cc72d9c442688252dd6029bc0778',
clientSecret: '159520a4a3564432a638fde8f263b943',
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
  res.render('index');
});

app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', {items: data.body.artists.items});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function(data) {
      res.render('albums', {items: data.body.items});
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    res.render('tracks', {items: data.body.items});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
