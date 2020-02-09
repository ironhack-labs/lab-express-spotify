require('dotenv').config();

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
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

  app.get('/', (req, res, next) => {
      res.render("index");
  });

 
  app.get('/artist-search', (req, res) => {
      const searchedArtist = req.query.artist;
      spotifyApi
        .searchArtists(searchedArtist)
        .then(data => {
          //console.log('The received data from the API: ', data.body.artists.items);
          let result = data.body.artists.items;
          res.render('artist-search', {result})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/albums/:id', (req, res, next) => { 
    let artistId = req.params.id;
    spotifyApi
      .getArtistAlbums(artistId)
      .then(data => {
        let artistAlbum = data.body.items;
        res.render('albums', {artistAlbum});
      })
      .catch(err => console.log('The error while searching artists occurred: ', err))
  });

  app.get('/albums/songs/:id', (req, res, next) => { 
    let songId = req.params.id;
    spotifyApi
      .getAlbumTracks(songId)
      .then(data => {
        let albumSongs = data.body.items;
        res.render('songs', {albumSongs});
      })
      .catch(err => console.log('The error while searching artists occurred: ', err))
  });


  
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
