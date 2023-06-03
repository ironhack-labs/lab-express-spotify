require('dotenv').config()
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => console.log('Something went wrong  retrieving the access token', error));

app.get("/", (res, req, next) => {
  req.render("index")
})

app.get('/artist-search', (req, res) => {
  const artistName = req.query.artist;

  spotifyApi
    .searchArtists(artistName)
    .then(data => {
      console.log(data.body.artists.items)
      res.render('artist-search-result', { artists: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((artistAlbums) => {
      console.log(artistAlbums.body.items)
      const albums = artistAlbums.body.items;
      res.render('albums', {albums})
    })
    .catch(error => console.log('something went off',error))
});

app.get("/tracks/:albumId", (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((track) => {
      console.log(track.body.items)
      const dataTracks = track.body.items;
      res.render('tracks', {dataTracks})
    })
    .catch(error => console.log('something went off', error)) 
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
