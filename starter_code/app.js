const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

hbs.registerPartials(`${__dirname}/views/partials`);

const clientId = '98ce80351b624300a597e24386c08dc5';
const clientSecret = 'afe943ffb6384a25b954e15405e04ebc';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
  });

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then((data) => {
      console.log('The received data from the API: ', data.body);
      // res.send(data.body.artists.items);
      res.render('artists', { data });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then((data) => {
      // console.log('Artist information', data.body);
      // res.send(data);
      res.render('albums', { data });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then((data) => {
      // console.log('Track information', data.body);
      // res.send(data);
      res.render('tracks', { data });
    })
    .catch((err) => {
      console.error(err);
    });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
