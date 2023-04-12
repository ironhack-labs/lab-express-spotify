require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

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
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/artist-search', (req, res) => {
    const { artistName } = req.query;
    // const { artist } = req.query
    spotifyApi
  .searchArtists(`${artistName}`)
  .then(response => {
    const artistsList = response.body.artists.items;

    res.render("artistSearchResult", {artistsList})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/albums/:artistId', (req, res) => {
    const {artistId} = req.params;

    spotifyApi.getArtistAlbums(`${artistId}`)
    .then(response => {
        const albumsList = response.body.items
        res.render('albums', { albumsList })
    })
    .catch(err => console.log(err))
  })

  app.get('/tracks/:albumId', (req, res) => {
    const {albumId} = req.params;

    spotifyApi
    .getAlbumTracks(`${albumId}`)
    .then(response => {
        const tracksList = response.body.items

        res.render('tracks', {tracksList})
    })
    .catch(err => console.log(err))
  })



//Se uede poner aquí proccess.env....
app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'));
