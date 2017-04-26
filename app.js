const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

const spotify = new SpotifyWebApi();

// instruct the app to use the `bodyParser()` middleware for all routes
// http://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

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
    //console.log(artists[0]);
    res.render('artists', { artists });
  });
});

// Album Route:
app.get('/albums/:artistId', (req, res) => {
  // const artistid2 = req.body;
  const artistId = '2ye2Wgw4gimLv2eAKyk1NB';
  spotify.getArtistAlbums(artistId, {}, (err, data) => {
    if (err) throw err;
    // console.log(data.body);
    // console.log(req.body.name);
    const albums = data.body;
    res.render('albums', { albums });
  });
});

// Track
app.get('/tracks/:trackid', (req, res) => {
  const albumId = '4kwN2OnnrwY2ZBcm379Ahn';
  spotify.getAlbumTracks(albumId, {}, (err, data) => {
    if (err) throw err;
    console.log(data.body);
    const tracks = data.body;
    console.log(tracks);
    res.render('tracks', { tracks });
  });
});

// start server
app.listen(3000, () => console.log('The server has started'));
