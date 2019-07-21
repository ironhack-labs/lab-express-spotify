const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const Spotify = require('spotify-web-api-js');


// require spotify-web-api-node package here:

const s = new Spotify();
const indexRouter = require('./routes/index');

 const app = express();

 // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

 app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

 app.use('/', indexRouter);

 // catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

 // error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
  res.status(err.status || 500);
  res.render('error');
});





app.get('/artists', (req, res, next) => {
  const {artist} = req.query;

  spotifyApi.searchArtists(artist)
      .then(data => {
        const items = data.body.artists.items;

        res.render('artists',{items});
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      })
})


app.get('/artists/:artistId', (req, res) => {
  const artistId = req.params.artistId;

  spotifyApi.getArtistAlbums(artistId).then(
    function(data) {
      const albums = data.body.items;
      res.render('albums', {albums});
    },
    function(err) {
      console.error(err);
    }
    );

  });
app.get('/albums/:albumId', (req, res) => {
const trackId = req.params.albumId;

  spotifyApi.getAlbumTracks(trackId, { limit : 5, offset : 1 })
  .then(function(data) {
    const tracks = data.body.items;

    res.render('tracks',{tracks} )
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

// Remember to insert your credentials here
const clientId = '5c79a8bef56c46b8bbc401d78dd2156b',
    clientSecret = '3825e830cb6f40f281bdbade7b96a960';

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

 module.exports = app;