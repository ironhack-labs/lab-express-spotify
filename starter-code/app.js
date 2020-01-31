require('dotenv').config('.env');
const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: '096b5ca8c3824ae5a5ca4bc26c6dc8bd',
  clientSecret: '9c61dd34cc2c45ee92dd194ef00ec6d0',
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    // console.log('The access token expires in ' + data.body['expires_in']);
    // console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error),
  );

const app = express();

app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    /* layoutsDir: path.resolve(__dirname, 'views/layouts' */
    helpers: {
      displayTracks: function(item) {
        return item.displayTracks;
      },
    },
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});
app.get('/artist-search', (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then((artistResult) => {
      //   res.send(artistResult.body.artists);
      //   console.log(artistResult.body.artists.items);
      res.render('artist-search-results', {
        artistList: artistResult.body.artists.items,
      });
    })
    .catch((err) => {
      console.log(err.message);
      console.error(err);
      res.status(err.status).send('nix gefunden');
    });
});
app.get('/albums/:artistId', (req, res) => {
  const { artistId } = req.params;
  console.log(artistId, req.params);
  spotifyApi
    .getArtistAlbums(artistId)
    .then((albumResult) => {
      //   res.send(albumResult.body.items);
      console.log(albumResult.body.items[0]);
      res.render('albums', {
        artistList: albumResult.body.items,
        artistName: albumResult.body.items[0].artists[0].name,
        albumDetails: true,
      });
    })
    .catch((err) => {
      console.log(err.message);
      console.error(err);
    });
});

hbs('displayTracks', () => {
  return displayTracks; //just return global variable value
});

app.get('/tracks/:albumId', (req, res) => {
  const { albumId } = req.params;
  console.log(albumId, req.params);
  spotifyApi
    .getAlbumTracks(albumId)
    .then((albumResult) => {
      //   res.send(albumResult.body);
      console.log(albumResult.body.items);
      res.render('tracks-list', { tracks: albumResult.body.items });
    })
    .catch((err) => {
      console.log(err.message);
      console.error(err);
    });
});

// setting the spotify-api goes here:

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'),
);
