const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const SpotifyWebAPI = require('spotify-web-api-node');

const app = express();

hbs.registerPartials(path.join(__dirname, '/views/partials'));

const spotifyAPI = new SpotifyWebAPI({
  clientId: 'cced69ef4f52428381a0a3a7319bf2cf',
  clientSecret: '4c67e1a4f61d46f7816e7c7fec2843e2',
});

spotifyAPI.clientCredentialsGrant()
  .then((data) => {
    spotifyAPI.setAccessToken(data.body.access_token);
  })
  .catch((err) => {
    console.log('Error retrieving access token:', err);
  });

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/artists', (req, res, next) => {
  const artist = req.body.artist;

  spotifyAPI.searchArtists(artist)
    .then((data) => {
      artistArray = data.body.artists.items;
      res.render('artists', { artistArray });
    })
    .catch((err) => {
      console.log(`Error fetching artists: ${err}`);
    });
});

app.get('/albums/:artistID', (req, res, next) => {
  const artist = req.params.artistID;

  spotifyAPI.getArtistAlbums(artist)
    .then((data) => {
      albumArray = data.body.items;
      res.render('albums', { albumArray });
    })
    .catch((err) => {
      console.log(`Error fetching album data: ${err}`);
    });
});

app.get('/tracks/:albumID', (req, res, next) => {
  const album = req.params.albumID;

  spotifyAPI.getAlbumTracks(album)
    .then((data) => {
      trackArray = data.body.items;
      res.render('tracks', { trackArray });
    })
    .catch((err) => {
      console.log('Error fetching tracks:', err);
    });
});

app.listen(3000);
