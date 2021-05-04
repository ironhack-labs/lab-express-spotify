require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const spotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home');
  });

app.get('/artist-search', (req, res) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    res.render('artist-search-results', { artists: data.body.artists.items })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next)=>{
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    res.render('albums',{ albums: data.body.items } )
  })
  .catch(err => console.error(err));
})

app.get('/tracks/:albumId', (req, res, next)=>{
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
    console.log('Album tracks', {tracks: data.body.items});
    res.render('tracks',{ tracks: data.body.items })
  })
  .catch(err => console.error(err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
