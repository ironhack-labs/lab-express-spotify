const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

const SpotifyWebApi = require('spotify-web-api-node');
// Remember to paste here your credentials
var clientId = 'a10b9f93970a4bc59718219350d5a700',
  clientSecret = 'c38c4978dd324fba88a176c91d89efc7';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });
//los get tienen q ir en orden de ruta


app.get('/', (req, res) => {
  res.render('home');
});

app.get('/artists', (req, res) => {
  let artistSearch = req.query.artist;
  spotifyApi.searchArtists(artistSearch)
    .then(function(data) {
      let artistsArray = data.body.artists.items;
      res.render('artists', {artist: artistsArray});
      }, function(err) {
      console.error(err);
    });
});

app.get('/artist/:id', (req, res) => {
  let artistId = req.params.id;

  spotifyApi.getArtistsAlbums(artistId)
    .then(function(data) {
      let artistsItems = data.body.artists.items;
      res.render('artist', {artist: artistsItems});
      console.log(data.body.artists.items);
    }, function(err) {
      console.error(err);
    });
});


// app.get('/album/:id', (req, res) => {
//   let album = req.params.id;
//   spotifyApi.getAlbumTracks(album)
//     .then(function(data) {
//       let tracksArray = data.body.items;
//       res.render('artists', {tracks: artistsArray});
//     }, function(err) {
//       console.error(err);
//     });
// });

//esta parte de la ruta es variable
// app.get('/artists/:id', (req, res) => {
//   console.log(req.params.id);
//   res.render('home');
// });

// app.post('/home', (req, res) => {
//   res.send(req.body);
// });

// Search artists whose name contains 'Love'



app.use(express.static('public'));










app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
