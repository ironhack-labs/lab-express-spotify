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
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.q, { limit: 20, offset: 0 })
    .then((data) => {
      console.log('artist-search searchArtists');
      res.render('artist-search-results', { artists: data.body.artists.items });
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

      let albums = data.body.items.map((album) => {
        let img;
        if (album.images[1]) {
          img = album.images[1].url;
        } else if (album.images[0]) {
          img = album.images[0].url;
        }
        return { id: album.id, name: album.name, img };
      });
      res.render('albums', { albumsraw: data.body.items, albums });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId, { limit: 15, offset: 0 })
    .then((data) => {
      console.log('tracks getAlbumTracks');

      res.render('tracks', { tracks: data.body.items });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.listen(port, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
