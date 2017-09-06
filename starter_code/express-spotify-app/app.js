const SpotifyWebApi   = require('spotify-web-api-node');
const spotify = new SpotifyWebApi({
    clientId : 'b5b7561cbcb04c869bae40eed5c71269',
    clientSecret : '990748f563da496dadb97356429c5096',
  });
const express         = require('express');
const app             = express();
const bodyParser      = require('body-parser');
const expressLayouts  = require('express-ejs-layouts');
app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/main-layout');
app.set('view engine', 'ejs');

spotify.clientCredentialsGrant()
.then(function(data) {
  console.log('The access token expires in ' + data.body['expires_in']);
  console.log('The access token is ' + data.body['access_token']);

  // Save the access token so that it's used in future calls
  spotify.setAccessToken(data.body['access_token']);
}, function(err) {
  console.log('Something went wrong when retrieving an access token', err.message);
});


app.get('/', (request, response, next) => {
    response.render("index");
})

app.get('/artist', (req, res, next) => {
    spotify.searchArtists(req.query.artist, {}, (err, data) => {
    if (err) throw err;
    
    let artists = data.body.artists.items;
    res.render('artists',{ artists });
    });
});


app.get('/albums/:artistId', (req, res) => {
  spotify.getArtistAlbums(req.params.artistId, {}, (err, data) => {
  if (err) throw err;
  
  let albums = data.body.items;
  res.render('albums', { albums });
  })
});

app.get('/tracks/:albumId', (req, res) => {
  spotify.getAlbumTracks(req.params.albumId, {}, (err, data) => {
  if (err) throw err;
  
  let tracks = data.body.items;
  console.log(tracks);
  res.render('tracks', { tracks });
  })
});

app.listen(3000, () => {
  });