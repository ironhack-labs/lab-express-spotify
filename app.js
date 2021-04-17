require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

const port = 3010;
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    return spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
    if (error.statusCode == 401) {
      console.log('**** ACCESS TOKEN EXPIRED ***** AND NOW? ****');
    }
    return;
  });

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.q, { limit: 20, offset: 0 })
    .then((data) => {
      console.log('artist-search searchArtists');

      if (req.query.help && req.query.help == 1) {
        res.send(data.body);
      } else if (data.body.artists.items.length) {
        res.render('artist-search-results', {
          artists: data.body.artists.items,
        });
      } else {
        res.render('emptyresult');
      }
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});
app.get('/albums/:artistId', (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId, { limit: 20, offset: 0 })
    .then((data) => {
      console.log('albums getArtistAlbums');

      if (req.query.help && req.query.help == 1) {
        res.send(data.body);
      } else if (data.body.items.length) {
        let albums = data.body.items.map((album) => {
          let img;
          if (album.images && album.images.length > 2) {
            img = album.images[album.images.length - 2].url;
          } else if (album.images) {
            img = album.images[0].url;
          }
          return { ...album, img };
        });
        res.render('albums', { albums });
      } else {
        res.render('emptyresult');
      }
    })
    .catch((err) =>
      console.log('The error while searching artists albums occurred: ', err)
    );
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId, { limit: 15, offset: 0 })
    .then((data) => {
      console.log('tracks getAlbumTracks');

      if (req.query.help && req.query.help == 1) {
        res.send(data.body);
      } else if (data.body.items.length) {
        res.render('tracks', { tracks: data.body.items });
      } else {
        res.render('emptyresult');
      }
    })
    .catch((err) =>
      console.log('The error while retrieving tracks occurred: ', err)
    );
});

app.listen(port, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
