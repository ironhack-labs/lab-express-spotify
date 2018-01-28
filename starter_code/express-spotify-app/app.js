var SpotifyWebApi = require('spotify-web-api-node');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');

const app = express();

// view engine setup
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Remember to paste here your credentials
var clientId = '6236ac9c37b34beda041a7e8aabb61ba',
    clientSecret = '72d683e5345f47a4959d992bbbee0b0b';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res, next) => {
  res.render('home');
});

app.post('/artists', (req, res, next) => {
  let artist = req.body.artist;
  let search = req.body.artist;

  spotifyApi.searchArtists(artist)
  .then((artist) => {
    let results = artist.body.artists.items;
    res.render('artists', {
      artists: results,
      search: search
    });
  })
  .catch((err) => {
    console.log(err);
  })
});


app.get('/albums/:id', (req, res) => {
let artistId = req.params.id;

spotifyApi.getArtistAlbums(artistId)
  .then((album) => {
    let albumArray = album.body.items;
    res.render('albums', {
      albums : albumArray
    });
  })
  .catch((err) => {
    console.log(err);
  })
});

app.get('/albums/tracks/:trackId', (req, res) => {
  let trackId = req.params.trackId;

  spotifyApi.getAlbumTracks(trackId)
    .then((tracks) => {
      let trackArray = tracks.body.items;
      res.render('tracks', {
        tracklist : trackArray
      })
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/albums/toptracks/:toptrackId', (req, res) => {
  let toptrackId = req.params.toptrackId;

  spotifyApi.getArtistTopTracks(toptrackId, 'GB')
    .then((tracks) => {
      let trackArray = tracks.body.tracks;
      res.render('toptracks', {
        tracklist : trackArray
      })
    })
    .catch((err) => {
      console.log(err);
    });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Starting server
app.listen(3000, () => {
  console.log('Server ready!')
});
