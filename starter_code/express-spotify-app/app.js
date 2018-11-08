

const express = require('express');

const app = express();
const morgan = require('morgan');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
hbs.registerPartials(path.join(__dirname, '/views/partials'));

// Remember to paste your credentials here
const clientId = '633451f84a7b4ec4a43ed0e928dc3315';

const clientSecret = '8a148056d1c549cdad811f3c005fd1f2';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body.access_token);
  }, (err) => {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get('/', (request, response) => {
  response.render('homepage');
});

app.get('/artists', (request, response) => {
  spotifyApi.searchArtists(`${request.query.artist}`)
    .then((data) => {
      const artists = data.body.artists.items;
      response.render('artists', { artists });
    })
    .catch((err) => {
      console.error(err);
    });
});


app.get('/albums/:id', (request, response) => {
  spotifyApi.getArtistAlbums(request.params.id).then(
    (data) => {
      const albums = data.body.items;
      response.render('albums', { albums });
    },
    (err) => {
      console.error(err);
    },
  );
});

app.get('/tracks/:id', (request, response) => {
  spotifyApi.getAlbumTracks(request.params.id, { limit: 10, offset: 1 })
    .then((data) => {
      const tracks = data.body.items;
      response.render('tracks', { tracks });
    }, (err) => {
      console.log('Something went wrong!', err);
    });
});

app.listen(3000, () => console.log('listen http://localhost:3000/'));
