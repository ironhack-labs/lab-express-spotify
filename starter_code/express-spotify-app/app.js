const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');

const path = require('path');

const hbs = require('hbs');

const bodyParser = require('body-parser');

const app = express();

const clientId = '46b54da592cb457e81cd31f44841e72c';
const clientSecret = 'bae1796f914e49efa54122868216ea4c';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body.access_token);
  }, (err) => {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.body.searchQuery)
    .then((data) => {
      const artists = data.body.artists.items.map(elem => ({
        name: elem.name,
        images: elem.images[0],
        id: elem.id,
      }));
      return res.render('artists', { artists });
    })
    .catch((err) => {
      console.log('Something went wrong when retrieving the artists', err);
    });
});

app.get('/albums/:id', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id)
    .then((data) => {
      const albums = data.body.items.map(elem => ({
        name: elem.name,
        images: elem.images[0],
        id: elem.id,
      }));
      return res.render('albums', { albums });
    })
    .catch((err) => {
      console.log('Something went wrong when retrieving the artists', err);
    });
});

app.get('/tracks/:id', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id)
    .then((data) => {
      const tracks = data.body.items.map(elem => ({
        name: elem.name,
        preview: elem.preview_url,
      }));
      return res.render('tracks', { tracks });
    })
    .catch((err) => {
      console.log('Something went wrong when retrieving the artists', err);
    });
});

app.listen(3000, () => console.log('Running'));
