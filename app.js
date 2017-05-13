const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const SpotifyWebApi = require('spotify-web-api-node');
const flash = require('connect-flash');

const app = express();

const spotify = new SpotifyWebApi();

// instruct the app to use the `bodyParser()` middleware for all routes
// http://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(flash());
app.use(express.static('public'));
app.use(morgan('dev'));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

// Index Route:
app.get('/', (req, res) => {
  res.render('index');
});

// Artist Route:
app.post('/artists/', (req, res) => {
  const artistName = req.body.artist;
  spotify.searchArtists(artistName, {}, (err, data) => {
    if (err) throw err;
    const artists = data.body.artists.items;
    if (artists.length === 0) {
      res.render('index');
    } else {
      res.render('artists', { artists });
    }
  });
});

// Album Route:
app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  spotify.getArtistAlbums(artistId, {}, (err, data) => {
    if (err) throw err;
    // console.log(data.body);
    // console.log(req.body.name);
    const albums = data.body;
    res.render('albums', { albums });
  });
});

// Track
app.get('/tracks/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  spotify.getAlbumTracks(albumId, {}, (err, data) => {
    if (err) throw err;
    const tracks = data.body;
    res.render('tracks', { tracks });
  });
});

// start server
app.listen(3000, () => console.log('The server has started'));

