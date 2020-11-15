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
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/search-artists', (req, res, next)=>{
    spotifyApi
    .searchArtists(req.query.searchWord)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      let artistDetails = data.body.artists.items;
    //   let artistImg = []; // loop thorough the array and push them into another
    //   for (let i=0; i<data.body.artists.items.images.length; i++){
    //       artistImg.push(data.body.artists.items.images[i]);
    //   };
      console.log(artistDetails)
      res.render('artist-search-results', {artistDetails});
    })
    .catch(err => res.send('The error while searching artists occurred: ', err));
    })

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(
        function(data) {
            let artistAlbums = data.body.items;
          console.log('Artist albums', data.body);
          res.render('albums', {artistAlbums});
        },
        function(err) {
          console.error(err);
        });
    });

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(function(data) {
    let albumTracks = data.body.items;
    console.log('Album Tracks: ', data.body.items);
    res.render('tracks', {albumTracks})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});


app.get('/', (req, res, next)=>{
    res.render('index');
});

app.listen(3001, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
