require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req, res) => {
    res.render('home-page');
  });

  app.get('/artist-search', (req, res) => {
    const searchPhrase = req.query['artist-name'];
    if (!searchPhrase) {
      return res.render('home-page', { error: 'Please enter an artist name' });
    }
    const query = `artist:${searchPhrase}`;
    spotifyApi
      .search(query, ['artist'], { limit: 1})
      .then(data => {
        const artists = data.body.artists.items;
        res.render('artist-search-results', { artists });
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  const PER_PAGE = 36; 

  app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    let offset = 0;
    let limit = PER_PAGE;
  
    spotifyApi.getArtist(artistId)
      .then(data => {
        const artist = data.body;
        return spotifyApi.getArtistAlbums(artistId, { offset, limit })
          .then(data => {
            const albums = data.body.items;
            const total = data.body.total;
            res.render('albums', { artist, albums, total });
          });
      })
      .catch(err => console.log('The error while searching albums occurred: ', err));
  });

app.get('/more-albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;
  const offset = parseInt(req.query.offset);
  const limit = PER_PAGE;

  spotifyApi.getArtistAlbums(artistId, { offset, limit })
    .then(data => {
      const albums = data.body.items;
      res.json({ albums });
    })
    .catch(err => console.log('The error while searching more albums occurred: ', err));
});


  app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    spotifyApi.getAlbumTracks(albumId)
      .then(data => {
        const tracks = data.body.items;
        res.render('tracks', { tracks });
      })
      .catch(err => console.log('The error while searching tracks occurred: ', err));
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
