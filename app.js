//REQUIREMENTS
const express    = require('express'),
      hbs        = require('hbs'),
      path       = require('path'),
      app        = express(),
      bodyParser = require('body-parser');

//SETTINGS
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, '/views/partials'));

//MIDDLEWARE
app.use(bodyParser.urlencoded({extended: true}))


//OTHER FUNCTIONS
let SpotifyWebApi = require('spotify-web-api-node');
let clientId = 'b2f720d600d746a9aa51dec948cd80bb',
    clientSecret = 'd606a9cff58e4fa58cbedace297676a4';

let spotifyApi = new SpotifyWebApi({
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

//SERVER/ROUTING RULES
app.get('/', (req, res) => {
  res.render('index.hbs')
})

app.post('/artists', (req, res, next) => {
  console.log(req.body.artist);
  spotifyApi.searchArtists(req.body.artist)
    .then(data => {
      const { items } = data.body.artists;
      res.render('artists', { items }) //data.body.artists.items[0].id
    })
    .catch(err => {
      res.send('Wrong band, bitch!!')
    })
});

app.get('/albums/:artistId', (req, res) => {
  console.log(req.params)
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(
    function(data) {
      const { items } = data.body;
      res.render('albums', { items });
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    const { items } = data.body
    res.render('tracks', { items });
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

//SERVER
app.listen(3000, console.log('http://localhost:3000'));