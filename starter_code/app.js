const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials');


const spotifyApi = new SpotifyWebApi({
  clientId: credentials.clientId,
  clientSecret: credentials.clientSecret,
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
  });


// Routes
app.get('/', (req, res) => {
  const data = req.query;
  res.render('index', data);
});

app.post('/artists', (req, res) => {
  spotifyApi.searchArtists(req.body.artist)
    .then((data) => {
      const items = data.body.artists.items;
      res.render('artists', { items });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId)
    .then((data) => {
      const items = data.body.items;
      res.render('albums', { items });
    })
    .catch(err => console.log(err));
});

app.get('/tracks/:id', (req, res) => {
  const { id } = req.params;
  spotifyApi.getAlbumTracks(id)
    .then((data) => {
      const items = data.body.items;
      res.render('tracks', { items });
    })
    .catch(err => console.log(err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
